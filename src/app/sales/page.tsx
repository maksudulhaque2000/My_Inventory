// src/app/sales/page.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import Modal from '@/components/Modal';
import AddSaleForm from '@/components/AddSaleForm';
import Spinner from '@/components/Spinner';

interface Sale {
  _id: string;
  product: { name: string; };
  customer: { name: string; };
  quantity: number;
  totalPrice: number;
  paymentStatus: 'Paid' | 'Due';
  saleDate: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSales = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sales');
      const data = await res.json();
      if (data.success) setSales(data.data);
    } catch (error) {
      console.error("Failed to fetch sales", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">সেলস রেকর্ড</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <FiPlus />
          <span>নতুন সেল</span>
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-5 py-3 border-b-2 text-left text-slate-800 font-semibold uppercase">প্রোডাক্ট</th>
              <th className="px-5 py-3 border-b-2 text-left text-slate-800 font-semibold uppercase">কাস্টমার</th>
              <th className="px-5 py-3 border-b-2 text-left text-slate-800 font-semibold uppercase">পরিমাণ</th>
              <th className="px-5 py-3 border-b-2 text-left text-slate-800 font-semibold uppercase">মোট মূল্য</th>
              <th className="px-5 py-3 border-b-2 text-left text-slate-800 font-semibold uppercase">স্ট্যাটাস</th>
              <th className="px-5 py-3 border-b-2 text-left text-slate-800 font-semibold uppercase">তারিখ</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6}><Spinner /></td></tr>
            ) : sales.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-4 font-bold text-xl text-red-600">কোনো সেলস পাওয়া যায়নি।</td></tr>
            ) : (sales.map((sale) => (
                <tr key={sale._id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 text-slate-800 border-b text-sm">{sale.product?.name || 'N/A'}</td>
                  <td className="px-5 py-4 text-slate-800 border-b text-sm">{sale.customer?.name || 'N/A'}</td>
                  <td className="px-5 py-4 text-slate-800 border-b text-sm">{sale.quantity}</td>
                  <td className="px-5 py-4 text-slate-800 border-b text-sm">৳ {sale.totalPrice}</td>
                  <td className="px-5 py-4 text-slate-800 border-b text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      sale.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {sale.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-800 border-b text-sm">{new Date(sale.saleDate).toLocaleDateString('bn-BD')}</td>
                </tr>
              )))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={<span className="text-slate-800">নতুন সেল রেকর্ড করুন</span>}>
        <AddSaleForm onSuccess={fetchSales} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}