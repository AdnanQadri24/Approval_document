import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const documentId = params.id;

        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!document) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(document);
    } catch (error) {
        console.error('Error fetching document:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const documentId = params.id;
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const summary = formData.get('summary') as string;
        const status = formData.get('status') as string;
        const file = formData.get('file') as File | null;

        // Validasi input
        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        // Cek apakah dokumen ada
        const existingDocument = await prisma.document.findUnique({
            where: { id: documentId }
        });

        if (!existingDocument) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            );
        }

        let fileUrl = existingDocument.fileUrl;

        // Jika ada file baru, upload dan hapus file lama
        if (file) {
            // Validasi tipe file
            if (file.type !== 'application/pdf') {
                return NextResponse.json(
                    { error: 'File must be PDF' },
                    { status: 400 }
                );
            }

            // Hapus file lama jika ada
            if (existingDocument.fileUrl) {
                try {
                    const { unlink } = await import('fs/promises');
                    const { join } = await import('path');
                    const filePath = join(process.cwd(), 'public', existingDocument.fileUrl);
                    await unlink(filePath);
                } catch (error) {
                    console.error('Error deleting old file:', error);
                }
            }

            // Upload file baru
            const { writeFile } = await import('fs/promises');
            const { join } = await import('path');
            
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            
            const timestamp = Date.now();
            const fileName = `${timestamp}_${file.name}`;
            
            const uploadDir = join(process.cwd(), 'public', 'uploads');
            const filePath = join(uploadDir, fileName);
            
            await writeFile(filePath, buffer);
            fileUrl = `/uploads/${fileName}`;
        }

        // Update dokumen di database
        const updatedDocument = await prisma.document.update({
            where: { id: documentId },
            data: {
                title,
                summary: summary || null,
                fileUrl,
                status
            }
        });

        return NextResponse.json(updatedDocument);
    } catch (error) {
        console.error('Error updating document:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const documentId = params.id;

        // Ambil data dokumen untuk mendapatkan fileUrl
        const document = await prisma.document.findUnique({
            where: { id: documentId }
        });

        if (!document) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            );
        }

        // Hapus file dari filesystem jika ada
        if (document.fileUrl) {
            try {
                const { unlink } = await import('fs/promises');
                const { join } = await import('path');
                const filePath = join(process.cwd(), 'public', document.fileUrl);
                await unlink(filePath);
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        }

        // Hapus dokumen dari database
        await prisma.document.delete({
            where: { id: documentId }
        });

        return NextResponse.json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}