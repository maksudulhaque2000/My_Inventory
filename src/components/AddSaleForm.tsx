'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import SearchableDropdown from './SearchableDropdown';

interface Product { _id: string; name: string; }
interface Customer { _id: string; name: string; phone: string; }

interface AddSaleFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const AddSaleForm = ({ onSuccess, onClose }: AddSaleFormProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const [quantity, setQuantity] = useState('1');
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Due'>('Paid');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
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
        toast.error("প্রোডাক্ট বা কাস্টমার আনতে সমস্যা হয়েছে।");
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
    const toastId = toast.loading('সেল রেকর্ড করা হচ্ছে...');
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: selectedProduct?._id,
          customer: selectedCustomer?._id,
          quantity: Number(quantity),
          paymentStatus,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      toast.success('সেল সফলভাবে রেকর্ড করা হয়েছে!', { id: toastId });
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
        <label className="block text-sm font-medium text-slate-800">প্রোডাক্ট সার্চ করুন</label>
        <SearchableDropdown
          items={products}
          selected={selectedProduct}
          setSelected={(item) => setSelectedProduct(item as Product | null)}
          placeholder="প্রোডাক্টের নাম লিখুন..."
          displayValue={(item) => item.name}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-800">কাস্টমার সার্চ করুন</label>
        <SearchableDropdown
          items={customers}
          selected={selectedCustomer}
          setSelected={(item) => setSelectedCustomer(item as Customer | null)}
          placeholder="কাস্টমারের নাম বা ফোন নম্বর..."
          displayValue={(item) => `${item.name} - ${item.phone}`}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-800">পরিমাণ (পিস)</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" 
               className="mt-1 block w-full px-3 py-2 text-slate-800 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-800">পেমেন্ট স্ট্যাটাস</label>
        <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as 'Paid' | 'Due')} 
                className="mt-1 block w-full px-3 py-2 text-slate-800 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Paid">Paid</option>
          <option value="Due">Due</option>
        </select>
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        {/* সরাসরি Tailwind ক্লাস ব্যবহার করা হয়েছে */}
        <button type="button" onClick={onClose} 
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors"
        >
            বাতিল
        </button>
        {/* সরাসরি Tailwind ক্লাস ব্যবহার করা হয়েছে */}
        <button type="submit" disabled={isSubmitting} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'রেকর্ড হচ্ছে...' : 'রেকর্ড করুন'}
        </button>
      </div>
      
      {/* <style jsx global> ব্লকটি সম্পূর্ণ সরিয়ে ফেলা হয়েছে </style> */}
    </form>
  );
};

export default AddSaleForm;