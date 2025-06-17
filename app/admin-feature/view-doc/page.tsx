import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import Link from 'next/link';
import ActionButtons from '@/components/action-button';
import SummaryCell from '@/components/summary-cells';

// Type definitions
interface User {
    name: string | null;
    email: string | null;
}

interface Document {
    id: string;
    title: string;
    summary: string | null;
    fileUrl: string | null;
    createdAt: Date;
    status: string;
    user: User;
}

// Fungsi untuk mengambil data
async function getDocuments(): Promise<Document[]> {
    try {
        const documents = await prisma.document.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
        return documents;
    } catch (error) {
        console.error('Error fetching documents:', error);
        return [];
    }
}

const ViewDocument: React.FC = async () => {
    const session = await auth();
    const documents = await getDocuments();

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Daftar Dokumen</h1>
                <Link
                    href="/admin-feature/create-doc"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    + Tambah Dokumen
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Judul Dokumen
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ringkasan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    File PDF
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal Dibuat
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {documents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        Belum ada dokumen yang dibuat
                                    </td>
                                </tr>
                            ) : (
                                documents.map((doc: Document) => (
                                    <tr key={doc.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {doc.title}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <SummaryCell
                                                summary={doc.summary}
                                                maxLength={100}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {doc.fileUrl ? (
                                                <a
                                                    href={doc.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    📄 Lihat PDF
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Tidak ada file</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(doc.createdAt).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${doc.status === 'Approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : doc.status === 'Pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <ActionButtons documentId={doc.id} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewDocument;