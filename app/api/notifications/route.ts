// File: app/api/notifications/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Hanya ambil notifikasi dokumen yang sudah disetujui standarisasi
        const notifications = await prisma.notification.findMany({
            where: {
                type: "info",
                document: {
                    status: "approved",
                    standardizationApproved: true
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(notifications);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
export async function POST(request: Request) {
    try {
        const session = await auth();
        
        if (!session || !["manager", "standarisasi"].includes(session.user.role)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, message, type, documentId } = await request.json();

        const notification = await prisma.notification.create({
            data: {
                title,
                message,
                type,
                documentId: documentId || null,
            },
        });

        return NextResponse.json(notification);
    } catch (error) {
        console.error("[NOTIFICATIONS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}