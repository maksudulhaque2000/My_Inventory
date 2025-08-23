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
  const [address, setAddress] = useState(''); // <-- ঠিকানা'র জন্য state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('অনুগ্রহ করে নাম এবং ফোন নম্বর পূরণ করুন।');
      return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading('কাস্টমার যোগ করা হচ্ছে...');

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, address }), // <-- ঠিকানা পাঠানো হচ্ছে
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success('কাস্টমার সফলভাবে যোগ করা হয়েছে!', { id: toastId });
      onSuccess();
      onClose();

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message, { id: toastId });
      } else {
        toast.error('An unknown error occurred', { id: toastId });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-slate-700">কাস্টমারের নাম</label>
        <input type="text" id="customerName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full input-field text-slate-600" />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">ফোন নম্বর</label>
        <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full input-field text-slate-600" />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-slate-700">ঠিকানা (ঐচ্ছিক)</label>
        <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="mt-1 block w-full input-field text-slate-600" />
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">বাতিল</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
          {isSubmitting ? 'সাবমিট হচ্ছে...' : 'সাবমিট করুন'}
        </button>
      </div>
       <style jsx global>{`.input-field { padding: 0.5rem 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.375rem; width: 100%; }`}</style>
    </form>
  );
};

export default AddCustomerForm;