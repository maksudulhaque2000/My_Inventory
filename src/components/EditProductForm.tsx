// src/components/EditProductForm.tsx
'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  importQuantity: number;
  price: number;
}

interface EditProductFormProps {
  product: Product;
  onSuccess: () => void;
  onClose: () => void;
}

const EditProductForm = ({ product, onSuccess, onClose }: EditProductFormProps) => {
  const [name, setName] = useState('');
  const [importQuantity, setImportQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setImportQuantity(String(product.importQuantity));
      setPrice(String(product.price));
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          importQuantity: Number(importQuantity),
          price: Number(price),
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success('প্রোডাক্ট সফলভাবে আপডেট করা হয়েছে!');
      onSuccess();
      onClose();

    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields are same as AddProductForm */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">প্রোডাক্টের নাম</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 text-slate-800 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="importQuantity" className="block text-sm font-medium text-slate-700">ইমপোর্ট পরিমাণ (পিস)</label>
        <input type="number" id="importQuantity" value={importQuantity} onChange={(e) => setImportQuantity(e.target.value)}
          className="mt-1 block w-full px-3 py-2 text-slate-800 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-slate-700">মূল্য (প্রতি পিস)</label>
        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)}
          className="mt-1 block w-full px-3 py-2 text-slate-800 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">বাতিল</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
          {isSubmitting ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
        </button>
      </div>
    </form>
  );
};

export default EditProductForm;