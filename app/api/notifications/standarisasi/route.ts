import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        
        if (!session || session.user.role !== "standarisasi") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const notifications = await prisma.notification.findMany({
            where: {
                type: "info", // Notifikasi untuk standarisasi
                document: {
                    managerApproved: true,
                    standardizationApproved: false
                }
            },
            include: {
                document: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(notifications);
    } catch (error) {
        console.error("[STANDARISASI_NOTIFICATIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}