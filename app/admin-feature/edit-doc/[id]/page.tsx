"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Document {
  id: string;
  title: string;
  summary: string | null;
  fileUrl: string | null;
  status: string;
}

const EditDocument = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState('');

  // Fetch document data
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/document/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setDocument(data);
          setTitle(data.title);
          setSummary(data.summary || '');
        } else {
          setError('Dokumen tidak ditemukan');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('Gagal memuat data dokumen');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDocument();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('summary', summary);
      // Admin tidak mengirim status, status tetap sama seperti sebelumnya
      formData.append('status', document?.status || 'Pending');

      if (file) {
        formData.append('file', file);
      }

      const response = await fetch(`/api/document/${params.id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update document');
      }

      router.push('/admin-feature/view-doc');
      router.refresh();
    } catch (error) {
      console.error('Error updating document:', error);
      setError(error instanceof Error ? error.message : 'Gagal mengupdate dokumen');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Memuat data dokumen...</div>
        </div>
      </div>
    );
  }

  if (error && !document) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Dokumen</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Kembali
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Judul Dokumen
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan judul dokumen"
              required
            />
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
              Ringkasan Dokumen
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tuliskan ringkasan dokumen"
              rows={4}
              required
            />
          </div>

          {/* Status hanya ditampilkan, tidak bisa diubah oleh admin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Dokumen
            </label>
            <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${document?.status === 'Approved'
                ? 'bg-green-100 text-green-800'
                : document?.status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
                }`}>
                {document?.status}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                (Hanya dapat diubah oleh Manager/Standarisasi)
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              File PDF (Opsional - biarkan kosong jika tidak ingin mengubah file)
            </label>
            <input
              type="file"
              id="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {document?.fileUrl && !file && (
              <p className="mt-1 text-sm text-gray-600">
                File saat ini: <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Lihat PDF</a>
              </p>
            )}
            {file && (
              <p className="mt-1 text-sm text-gray-600">
                File baru: {file.name}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isLoading ? 'Mengupdate...' : 'Update Dokumen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDocument;