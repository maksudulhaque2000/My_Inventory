// src/app/customers/page.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import Modal from '@/components/Modal';
import AddCustomerForm from '@/components/AddCustomerForm';
import Spinner from '@/components/Spinner';

interface Customer {
  _id: string;
  name: string;
  phone: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (data.success) setCustomers(data.data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">কাস্টমার লিস্ট</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <FiPlus />
          <span>নতুন কাস্টমার</span>
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-5 py-3 border-b-2 border-slate-200 text-left text-slate-800 font-semibold uppercase tracking-wider">নাম</th>
              <th className="px-5 py-3 border-b-2 border-slate-200 text-left text-slate-800 font-semibold uppercase tracking-wider">ফোন নম্বর</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={2}><Spinner /></td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={2} className="text-center py-4 font-bold text-xl text-red-600">কোনো কাস্টমার পাওয়া যায়নি।</td></tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 border-b border-slate-200 text-sm text-slate-600">{customer.name}</td>
                  <td className="px-5 py-4 border-b border-slate-200 text-sm text-slate-600">{customer.phone}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="নতুন কাস্টমার যোগ করুন">
        <AddCustomerForm onSuccess={fetchCustomers} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}