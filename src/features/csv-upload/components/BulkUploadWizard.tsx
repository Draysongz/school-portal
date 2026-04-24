'use client';

import { useState } from 'react';
import Papa from 'papaparse';

interface BulkUploadProps {
  role: 'STUDENT' | 'TEACHER';
  onComplete?: () => void;
}

export function BulkUploadWizard({ role, onComplete }: BulkUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      Papa.parse(selectedFile, {
        header: true,
        complete: (results) => {
          setPreview(results.data.slice(0, 5)); // Show first 5 rows
        },
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const res = await fetch('/api/users/bulk-upload', {
          method: 'POST',
          body: JSON.stringify({
            rows: results.data,
            role,
            fileName: file.name,
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
          setMessage('Upload started in background. Check logs for progress.');
          if (onComplete) onComplete();
        } else {
          setMessage('Failed to start upload.');
        }
        setUploading(false);
      },
    });
  };

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-4 text-black">Bulk Upload {role}s</h3>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {preview.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 text-black">Preview (Top 5 rows)</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left text-black">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(preview[0]).map(key => <th key={key} className="px-2 py-1">{key}</th>)}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-t">
                    {Object.values(row).map((val: any, j) => <td key={j} className="px-2 py-1">{val}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`w-full py-2 px-4 rounded font-medium text-white ${!file || uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {uploading ? 'Uploading...' : 'Start Upload'}
      </button>

      {message && <p className="mt-4 text-sm text-center font-medium text-blue-600">{message}</p>}
    </div>
  );
}
