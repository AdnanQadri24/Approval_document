import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DocumentStandardizationReview } from "./document-standardization-review";

export default async function DocumentStandardizationReviewPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await auth();

    if (!session || session.user.role !== "standarisasi") {
        redirect("/login");
    }

    const document = await prisma.document.findUnique({
        where: { id: params.id },
        include: { user: true },
    });

    if (!document) {
        redirect("/standarisasi");
    }

    // Cek apakah dokumen sudah disetujui manager
    if (!document.managerApproved) {
        redirect("/standarisasi");
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Review Standarisasi Dokumen</h1>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold">{document.title}</h2>
                    <p className="text-gray-600">Dikirim oleh: {document.user.name}</p>
                    <p className="text-sm text-gray-500">
                        Tanggal: {new Date(document.createdAt).toLocaleDateString("id-ID")}
                    </p>
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Ringkasan:</h3>
                    <p className="text-gray-700">{document.summary}</p>
                </div>

                {document.managerNotes && (
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Catatan Manager:</h3>
                        <p className="text-gray-700 bg-blue-50 p-3 rounded">{document.managerNotes}</p>
                    </div>
                )}

                {document.fileUrl && (
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">File:</h3>
                        <a
                            href={document.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            Lihat File
                        </a>
                    </div>
                )}

                <DocumentStandardizationReview documentId={document.id} />
            </div>
        </div>
    );
} 