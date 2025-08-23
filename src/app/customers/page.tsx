// src/app/customers/page.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import AddCustomerForm from '@/components/AddCustomerForm';
import EditCustomerForm from '@/components/EditCustomerForm';
import Spinner from '@/components/Spinner';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  address: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalContent, setModalContent] = useState<'add' | 'edit' | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (data.success) setCustomers(data.data);
    } catch (error) {
      toast.error("কাস্টমার তালিকা আনতে সমস্যা হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const openModal = (type: 'add' | 'edit', customer: Customer | null = null) => {
    setModalContent(type);
    setSelectedCustomer(customer);
  };

  const closeModal = () => {
    setModalContent(null);
    setSelectedCustomer(null);
  };

  const handleDelete = async (customerId: string) => {
    if (window.confirm('আপনি কি নিশ্চিতভাবে এই কাস্টমারকে ডিলিট করতে চান?')) {
      const toastId = toast.loading('ডিলিট করা হচ্ছে...');
      try {
        const res = await fetch(`/api/customers/${customerId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('ডিলিট করতে ব্যর্থ!');
        toast.success('কাস্টমার সফলভাবে ডিলিট করা হয়েছে!', { id: toastId });
        fetchCustomers();
      } catch (error: any) {
        toast.error(error.message, { id: toastId });
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">কাস্টমার লিস্ট</h1>
        <button onClick={() => openModal('add')} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <FiPlus />
          <span>নতুন কাস্টমার</span>
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-5 py-3 border-b-2 text-left text-slate-800 font-semibold uppercase">নাম</th>
              <th className="px-5 py-3 border-b-2 text-left text-slate-800 font-semibold uppercase">ফোন নম্বর</th>
              <th className="px-5 py-3 border-b-2 text-left text-slate-800 font-semibold uppercase">ঠিকানা</th>
              <th className="px-5 py-3 border-b-2 text-left text-slate-800 font-semibold uppercase">একশন</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4}><Spinner /></td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-4">কোনো কাস্টমার পাওয়া যায়নি।</td></tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 border-b text-sm text-slate-800">{customer.name}</td>
                  <td className="px-5 py-4 border-b text-sm text-slate-800">{customer.phone}</td>
                  <td className="px-5 py-4 border-b text-sm text-slate-800">{customer.address || 'N/A'}</td>
                  <td className="px-5 py-4 border-b text-sm text-slate-800">
                    <div className="flex space-x-3">
                      <button onClick={() => openModal('edit', customer)} className="text-blue-600 hover:text-blue-800"><FiEdit size={18} /></button>
                      <button onClick={() => handleDelete(customer._id)} className="text-red-600 hover:text-red-800"><FiTrash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalContent !== null} onClose={closeModal} title={<span className="text-slate-800">
      {modalContent === 'add' ? 'নতুন কাস্টমার' : 'কাস্টমার এডিট করুন'}
    </span>}>
        {modalContent === 'add' && <AddCustomerForm onSuccess={fetchCustomers} onClose={closeModal} />}
        {modalContent === 'edit' && selectedCustomer && <EditCustomerForm customer={selectedCustomer} onSuccess={fetchCustomers} onClose={closeModal} />}
      </Modal>
    </div>
  );
}