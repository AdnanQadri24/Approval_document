"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DocumentStandardizationReview({ documentId }: { documentId: string }) {
    const router = useRouter();
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (status: "approved" | "rejected") => {
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch(`/api/document/${documentId}/standardization`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status,
                    notes,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Gagal mengirim review standarisasi");
            }

            router.push("/standarisasi");
            router.refresh();
        } catch (error) {
            console.error("Error:", error);
            setError(error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim review standarisasi");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-6">
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Standarisasi (Opsional)
                </label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Tambahkan catatan standarisasi untuk dokumen ini..."
                />
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => handleSubmit("approved")}
                    disabled={isSubmitting}
                    className="flex-1 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Memproses..." : "Setujui Standarisasi"}
                </button>
                <button
                    onClick={() => handleSubmit("rejected")}
                    disabled={isSubmitting}
                    className="flex-1 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Memproses..." : "Tolak Standarisasi"}
                </button>
            </div>
        </div>
    );
} 