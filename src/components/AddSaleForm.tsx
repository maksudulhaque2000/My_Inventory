// src/components/AddSaleForm.tsx
'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Product { _id: string; name: string; }
interface Customer { _id: string; name: string; }

interface AddSaleFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const AddSaleForm = ({ onSuccess, onClose }: AddSaleFormProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Due'>('Paid');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch products and customers for dropdowns
    const fetchData = async () => {
      try {
        const [prodRes, custRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/customers'),
        ]);
        const prodData = await prodRes.json();
        const custData = await custRes.json();
        if (prodData.success) setProducts(prodData.data);
        if (custData.success) setCustomers(custData.data);
      } catch (error) {
        toast.error("প্রোডাক্ট বা কাস্টমার আনতে সমস্যা হয়েছে।");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !selectedCustomer || !quantity) {
      toast.error('অনুগ্রহ করে সকল ঘর পূরণ করুন।');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: selectedProduct,
          customer: selectedCustomer,
          quantity: Number(quantity),
          paymentStatus,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      toast.success('সেল সফলভাবে রেকর্ড করা হয়েছে!');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'সেল রেকর্ড করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-800">প্রোডাক্ট সিলেক্ট করুন</label>
        <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="mt-1 block w-full select-field text-slate-800">
          <option value="">--প্রোডাক্ট--</option>
          {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-800">কাস্টমার সিলেক্ট করুন</label>
        <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} className="mt-1 block w-full select-field text-slate-800">
          <option value="">--কাস্টমার--</option>
          {customers.map(c => <option key={c._id} value={c._id}>{c.name} - {c.phone}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-800">পরিমাণ (পিস)</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" className="mt-1 block w-full input-field text-slate-800" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-800">পেমেন্ট স্ট্যাটাস</label>
        <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as 'Paid' | 'Due')} className="mt-1 block w-full select-field text-slate-800">
          <option value="Paid">Paid</option>
          <option value="Due">Due</option>
        </select>
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary">বাতিল</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'রেকর্ড হচ্ছে...' : 'রেকর্ড করুন'}
        </button>
      </div>
      {/* Add some base styles in globals.css for reusability */}
      <style jsx global>{`
        .input-field, .select-field {
          padding: 0.5rem 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 0.375rem;
          width: 100%;
        }
        .btn-primary {
          padding: 0.5rem 1rem;
          background-color: #2563eb;
          color: white;
          border-radius: 0.375rem;
        }
        .btn-primary:hover { background-color: #1d4ed8; }
        .btn-primary:disabled { background-color: #93c5fd; }
        .btn-secondary {
          padding: 0.5rem 1rem;
          background-color: #e2e8f0;
          color: #1e293b;
          border-radius: 0.375rem;
        }
        .btn-secondary:hover { background-color: #cbd5e1; }
      `}</style>
    </form>
  );
};

export default AddSaleForm;