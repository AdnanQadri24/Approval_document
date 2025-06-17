"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateDocument = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validasi file
      if (!file) {
        throw new Error('File PDF harus diupload');
      }

      if (file.type !== 'application/pdf') {
        throw new Error('File harus berformat PDF');
      }

      // Membuat FormData untuk upload file
      const formData = new FormData();
      formData.append('title', title);
      formData.append('summary', summary);
      formData.append('status', 'Pending');
      formData.append('file', file);

      const response = await fetch('/api/document', {
        method: 'POST',
        body: formData, // Menggunakan FormData untuk upload file
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create document');
      }

      router.push('/admin-feature/view-doc');
      router.refresh();
    } catch (error) {
      console.error('Error creating document:', error);
      setError(error instanceof Error ? error.message : 'Gagal membuat dokumen');
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Document</h1>
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

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Upload File PDF
            </label>
            <input
              type="file"
              id="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
            {file && (
              <p className="mt-1 text-sm text-gray-600">
                File terpilih: {file.name}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isLoading ? 'Membuat...' : 'Buat Dokumen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDocument;