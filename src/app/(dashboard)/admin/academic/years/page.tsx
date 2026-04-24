'use client';

import { useEffect, useState } from 'react';

export default function AcademicYearsPage() {
  const [years, setYears] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/academic/years')
      .then(res => res.json())
      .then(data => {
        setYears(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-black">Academic Years</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="p-6">Loading years...</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {years.map(year => (
                <tr key={year.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{year.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(year.startDate).toLocaleDateString()} - {new Date(year.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {year.isCurrent ? (
                      <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Current</span>
                    ) : (
                      <span className="text-gray-400">Past</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
