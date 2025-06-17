"use client";

import Link from 'next/link';
import { useState } from 'react';

interface ActionButtonsProps {
    documentId: string;
}

const ActionButtons = ({ documentId }: ActionButtonsProps) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
            setIsDeleting(true);
            try {
                const response = await fetch(`/api/document/${documentId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    // Refresh halaman setelah berhasil hapus
                    window.location.reload();
                } else {
                    const data = await response.json();
                    alert(data.error || 'Gagal menghapus dokumen');
                }
            } catch (error) {
                console.error('Error deleting document:', error);
                alert('Gagal menghapus dokumen');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <div className="flex space-x-2">
            <Link
                href={`/admin-feature/edit-doc/${documentId}`}
                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
                Edit
            </Link>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`text-red-600 hover:text-red-900 text-sm font-medium ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {isDeleting ? 'Menghapus...' : 'Hapus'}
            </button>
        </div>
    );
};

export default ActionButtons;