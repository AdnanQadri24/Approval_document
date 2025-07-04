import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ManagerPage() {
    const session = await auth();

    if (!session || session.user.role !== "manager") {
        redirect("/login");
    }

    const documents = await prisma.document.findMany({
        where: {
            OR: [
                {
                    managerApproved: false,
                    status: "pending"
                },
                {
                    managerApproved: false, 
                    status: { in: ["pending", "Pending"] }
                }
            ]
        },
        include: {
            user: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Dokumen yang Menunggu Persetujuan</h1>

            <div className="grid gap-4">
                {documents.map((doc) => (
                    <div key={doc.id} className="border p-4 rounded-lg shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-semibold">{doc.title}</h2>
                                <p className="text-gray-600">Dikirim oleh: {doc.user.name}</p>
                                <p className="text-sm text-gray-500">
                                    Tanggal: {new Date(doc.createdAt).toLocaleDateString("id-ID")}
                                </p>
                                {doc.fileUrl && (
                                    <a
                                        href={doc.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
                                    >
                                        📄 Lihat PDF
                                    </a>
                                )}
                            </div>
                            <Link
                                href={`/manager/${doc.id}`}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Review
                            </Link>
                        </div>
                    </div>
                ))}

                {documents.length === 0 && (
                    <p className="text-center text-gray-500">Tidak ada dokumen yang menunggu persetujuan</p>
                )}
            </div>
        </div>
    );
}