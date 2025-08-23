// src/components/AddProductForm.tsx
'use client';
import { useState } from 'react';

interface AddProductFormProps {
  onSuccess: () => void; // ফর্ম সাবমিট সফল হলে এই ফাংশন কল হবে
  onClose: () => void;
}

const AddProductForm = ({ onSuccess, onClose }: AddProductFormProps) => {
  const [name, setName] = useState('');
  const [importQuantity, setImportQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !importQuantity || !price) {
      setError('অনুগ্রহ করে সকল ঘর পূরণ করুন।');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          importQuantity: Number(importQuantity),
          price: Number(price),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      alert('প্রোডাক্ট সফলভাবে যোগ করা হয়েছে!');
      onSuccess(); // প্রোডাক্ট লিস্ট রিফ্রেশ করার জন্য
      onClose(); // মডাল বন্ধ করার জন্য

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">প্রোডাক্টের নাম</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 text-slate-800 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="importQuantity" className="block text-sm font-medium text-slate-700">ইমপোর্ট পরিমাণ (পিস)</label>
        <input
          type="number"
          id="importQuantity"
          value={importQuantity}
          onChange={(e) => setImportQuantity(e.target.value)}
          className="mt-1 block w-full px-3 py-2 text-slate-800 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-slate-700">মূল্য (প্রতি পিস)</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 block w-full px-3 py-2 text-slate-800 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

export default AddProductForm;