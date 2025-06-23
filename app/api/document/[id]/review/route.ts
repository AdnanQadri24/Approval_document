import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        
        if (!session || session.user.role !== "manager") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { status, notes } = await request.json();

        if (!status || !["approved", "rejected"].includes(status)) {
            return new NextResponse("Invalid status", { status: 400 });
        }

        // Update document dengan approval manager
        const document = await prisma.document.update({
            where: { id: params.id },
            data: {
                managerApproved: status === "approved",
                managerNotes: notes || null,
                status: status === "approved" ? "pending" : "rejected", // Tetap pending jika approved
            },
        });

        // Kirim notifikasi ke admin jika ditolak
        if (status === "rejected") {
            await prisma.notification.create({
                data: {
                    title: "Dokumen Ditolak Manager",
                    message: `Dokumen "${document.title}" ditolak oleh Manager. Alasan: ${notes || "Tidak ada catatan"}`,
                    type: "rejection",
                    documentId: document.id,
                },
            });
        }

        // Kirim notifikasi ke standarisasi jika disetujui
        if (status === "approved") {
            await prisma.notification.create({
                data: {
                    title: "Dokumen Siap Review Standarisasi",
                    message: `Dokumen "${document.title}" telah disetujui Manager dan siap untuk review standarisasi.`,
                    type: "info",
                    documentId: document.id,
                },
            });
        }

        return NextResponse.json(document);
    } catch (error) {
        console.error("[DOCUMENT_REVIEW]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}