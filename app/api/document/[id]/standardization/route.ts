// File: app/api/document/[id]/standardization/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        
        if (!session || session.user.role !== "standarisasi") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { status, notes } = await request.json();

        if (!status || !["approved", "rejected"].includes(status)) {
            return new NextResponse("Invalid status", { status: 400 });
        }

        // Cek apakah dokumen sudah disetujui manager
        const existingDocument = await prisma.document.findUnique({
            where: { id: params.id },
        });

        if (!existingDocument) {
            return new NextResponse("Document not found", { status: 404 });
        }

        if (!existingDocument.managerApproved) {
            return new NextResponse("Document must be approved by manager first", { status: 400 });
        }

        // Update document dengan approval standarisasi
        const document = await prisma.document.update({
            where: { id: params.id },
            data: {
                standardizationApproved: status === "approved",
                standardizationNotes: notes || null,
                status: status === "approved" ? "approved" : "rejected",
            },
        });

        // Kirim notifikasi ke admin jika ditolak
        if (status === "rejected") {
            await prisma.notification.create({
                data: {
                    title: "Dokumen Ditolak Standarisasi",
                    message: `Dokumen "${document.title}" ditolak oleh Standarisasi. Alasan: ${notes || "Tidak ada catatan"}`,
                    type: "rejection",
                    documentId: document.id,
                },
            });
        }

        return NextResponse.json(document);
    } catch (error) {
        console.error("[DOCUMENT_STANDARDIZATION]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}