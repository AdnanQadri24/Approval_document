import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    const session = await getServerSession()

    if (!session || session.user.role !== 'manager') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { status, rejectionNote } = await request.json()

    if (!['approved', 'rejected'].includes(status)) {
      return new NextResponse('Invalid status', { status: 400 })
    }

    if (status === 'rejected' && !rejectionNote) {
      return new NextResponse('Rejection note is required', { status: 400 })
    }

    const document = await prisma.document.update({
      where: {
        id: params.documentId,
      },
      data: {
        approvalStatus: status,
        rejectionNote: status === 'rejected' ? rejectionNote : null,
        managerId: session.user.id,
        reviewedAt: new Date(),
      },
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error('Error approving document:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}