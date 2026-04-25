'use client';

import { useEffect, useState } from 'react';

export default function BillingDashboard() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    // Fetch data (endpoints would be implemented in Phase 6)
    // For now we'll mock the fetching or leave as skeleton
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-black mb-8">School Billing & Finances</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm font-medium">Subscription Status</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">Active</p>
          <p className="text-xs text-gray-400 mt-1">Renewal: June 20, 2026</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm font-medium">Monthly Revenue</h3>
          <p className="text-2xl font-bold text-black mt-2">$12,450.00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm font-medium">Outstanding Fees</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">$3,200.00</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-black">Recent Invoices</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Rows would be mapped here */}
            <tr className="hover:bg-gray-50 cursor-pointer">
              <td className="px-6 py-4 text-sm text-blue-600 font-medium">INV-2023-001</td>
              <td className="px-6 py-4 text-sm text-black">Alice Johnson</td>
              <td className="px-6 py-4 text-sm text-black">$500.00</td>
              <td className="px-6 py-4 text-sm">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Paid</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
