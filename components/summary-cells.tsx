'use client';

import { useState } from 'react';

interface SummaryCellProps {
    summary: string | null;
    maxLength?: number;
}

const SummaryCell: React.FC<SummaryCellProps> = ({ summary, maxLength = 100 }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    if (!summary || summary === '-') {
        return <span className="text-gray-400">-</span>;
    }

    const shouldTruncate = summary.length > maxLength;
    const truncatedSummary = shouldTruncate ? summary.substring(0, maxLength) + '...' : summary;

    const handleOpenModal = (): void => {
        setIsModalOpen(true);
    };

    const handleCloseModal = (): void => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="text-sm text-gray-900 max-w-xs">
                {truncatedSummary}
                {shouldTruncate && (
                    <button
                        onClick={handleOpenModal}
                        className="ml-2 text-blue-600 hover:text-blue-800 font-medium text-xs underline"
                        type="button"
                    >
                        Selengkapnya
                    </button>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl max-h-96 w-full mx-4 overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Ringkasan Dokumen
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
                                type="button"
                                aria-label="Tutup modal"
                            >
                                ×
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-64">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {summary}
                            </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                type="button"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SummaryCell;