// File: app/api/notifications/[id]/read/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        
        if (!session || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const notification = await prisma.notification.update({
            where: { id: params.id },
            data: { isRead: true },
        });

        return NextResponse.json(notification);
    } catch (error) {
        console.error("[NOTIFICATION_READ]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}