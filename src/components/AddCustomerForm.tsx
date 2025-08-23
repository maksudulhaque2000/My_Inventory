// src/components/AddCustomerForm.tsx
'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface AddCustomerFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const AddCustomerForm = ({ onSuccess, onClose }: AddCustomerFormProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('অনুগ্রহ করে সকল ঘর পূরণ করুন।');
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success('কাস্টমার সফলভাবে যোগ করা হয়েছে!');
      onSuccess();
      onClose();

    } catch (err: any) {
      toast.error(err.message || 'কিছু একটা সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-slate-700">কাস্টমারের নাম</label>
        <input
          type="text" id="customerName" value={name} onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">ফোন নম্বর</label>
        <input
          type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">বাতিল</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
          {isSubmitting ? 'সাবমিট হচ্ছে...' : 'সাবমিট করুন'}
        </button>
      </div>
    </form>
  );
};

export default AddCustomerForm;