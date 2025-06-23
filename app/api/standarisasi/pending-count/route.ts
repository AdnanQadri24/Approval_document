import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session || session.user.role !== "standarisasi") {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const count = await prisma.document.count({
        where: {
            status: "pending",
            managerApproved: true,
            standardizationApproved: false
        }
    });
    return NextResponse.json({ count });
}