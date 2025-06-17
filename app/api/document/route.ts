import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const session = await auth();
        
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const summary = formData.get('summary') as string;
        const status = formData.get('status') as string;
        const file = formData.get('file') as File;

        // Validasi input
        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        if (!file) {
            return NextResponse.json(
                { error: 'File is required' },
                { status: 400 }
            );
        }

        // Validasi tipe file
        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: 'File must be PDF' },
                { status: 400 }
            );
        }

        // Generate nama file unik
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Buat nama file unik dengan timestamp
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        
        // Simpan file ke folder public/uploads
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        const filePath = join(uploadDir, fileName);
        
        // Pastikan folder uploads ada
        try {
            await writeFile(filePath, buffer);
        } catch (error) {
            console.error('Error saving file:', error);
            return NextResponse.json(
                { error: 'Failed to save file' },
                { status: 500 }
            );
        }

        // Simpan data ke database
        const document = await prisma.document.create({
            data: {
                title,
                summary: summary || null,
                fileUrl: `/uploads/${fileName}`,
                status: status || 'Pending',
                userId: session.user.id
            }
        });

        return NextResponse.json(document);
    } catch (error) {
        console.error('Error creating document:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}