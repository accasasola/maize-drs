'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type RecordEntry = {
  score: string;
  cropStage: string;
  symptoms?: string;
  leafFeeding?: string;
  shotHoles?: string;
  lesions?: string;
  larvaeCount?: string;
  imageName?: string;
  img?: string;
  timestamp: string;
};

export default function SavedRecordsPage() {
  const [records, setRecords] = useState<RecordEntry[]>([]);
  const [filtered, setFiltered] = useState<RecordEntry[]>([]);
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('maizeRecords');
    if (data) {
      const parsed = JSON.parse(data);
      setRecords(parsed);
      setFiltered(parsed);
    }
  }, []);

  const handleClear = () => {
    if (confirm('Are you sure you want to delete all saved records?')) {
      localStorage.removeItem('maizeRecords');
      setRecords([]);
      setFiltered([]);
    }
  };

  const handleDelete = (index: number) => {
    const updatedRecords = [...records];
    updatedRecords.splice(index, 1);
    setRecords(updatedRecords);
    setFiltered(updatedRecords);
    localStorage.setItem("maizeRecords", JSON.stringify(updatedRecords));
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) return;

    const header = ['Timestamp', 'Score', 'Crop Stage', 'Symptoms', 'Image'];
    const rows = filtered.map((r) => [
      new Date(r.timestamp).toLocaleString(),
      r.score,
      r.cropStage,
      (r.symptoms?.replace(/\n/g, ' ') ||
  `Feeding: ${r.leafFeeding}, Shot Holes: ${r.shotHoles}, Lesions: ${r.lesions}, Larvae: ${r.larvaeCount}`),
      r.imageName || '—',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [header, ...rows].map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'maize_records.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    if (value === 'all') {
      setFiltered(records);
    } else {
      setFiltered(records.filter((r) => r.cropStage === value));
    }
  };

  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Saved Records</h1>

      {records.length === 0 ? (
        <p className="text-gray-600">No records found.</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700">
              Filter by Crop Stage:
            </label>
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All</option>
              <option value="vegetative">Vegetative</option>
              <option value="reproductive">Reproductive</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
            >
              Export as CSV
            </button>

            <button
              onClick={handleClear}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
            >
              Clear All Records
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700 text-sm">
              <thead className="bg-green-100 text-green-800">
                <tr>
                  <th className="border px-4 py-2 text-left">Date</th>
                  <th className="border px-4 py-2 text-left">Score</th>
                  <th className="border px-4 py-2 text-left">Stage</th>
                  <th className="border px-4 py-2 text-left">Image</th>
                  <th className="border px-4 py-2 text-left">Symptoms</th>
                  <th className="border px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record, index) => (
                  <tr key={index} className="hover:bg-green-50">
                    <td className="border px-4 py-2 text-gray-800">
                      {new Date(record.timestamp).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-gray-800">{record.score}</td>
                    <td className="border px-4 py-2 capitalize text-gray-800">{record.cropStage}</td>
                    <td className="border px-4 py-2 text-xs text-gray-800">
                      {record.imageName || '—'}
                      {record.img && (
                        <img
                          src={record.img}
                          alt="preview"
                          className="mt-2 w-20 h-20 object-cover border"
                        />
                      )}
                    </td>
                    <td className="border px-4 py-2 whitespace-pre-wrap text-gray-800">
                      {record.symptoms ||
                        `Feeding: ${record.leafFeeding}, Shot Holes: ${record.shotHoles}, Lesions: ${record.lesions}, Larvae: ${record.larvaeCount}`}
                    </td>
                    <td className="border px-4 py-2 text-red-600 text-sm">
                      <button
                        onClick={() => handleDelete(index)}
                        className="hover:underline hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <button
        onClick={() => router.push('/')}
        className="mt-8 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
      >
        Back to Home
      </button>
    </main>
  );
}
