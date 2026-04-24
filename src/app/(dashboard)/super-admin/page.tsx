'use client';

import { useEffect, useState } from 'react';

export default function SuperAdminDashboard() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/super-admin/schools')
      .then((res) => res.json())
      .then((data) => {
        setSchools(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-black">Super Admin Dashboard</h1>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-black">Schools</h2>
        {loading ? (
          <p className="text-black">Loading...</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subdomain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schools.map((school) => (
                <tr key={school.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{school.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{school.subdomain}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-black">{school._count.profiles}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${school.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {school.isActive ? 'Active' : 'Inactive'}
                    </span>
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
