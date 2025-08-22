// src/app/products/page.tsx
'use client'; 

import { useState, useEffect, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import Modal from '@/components/Modal';
import AddProductForm from '@/components/AddProductForm';

interface Product {
  _id: string;
  name: string;
  importQuantity: number;
  price: number;
  soldQuantity: number;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">প্রোডাক্ট লিস্ট</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          <FiPlus />
          <span>নতুন প্রোডাক্ট যোগ করুন</span>
        </button>
      </div>
      
      {/* Main Content: Table */}
      {/* ... (আপনার টেবিলের কোড এখানে থাকবে, কোনো পরিবর্তন নেই) ... */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          {/* ... table head ... */}
          <thead className="bg-slate-100">
              <tr>
                <th className="px-5 py-3 border-b-2 border-slate-200 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">প্রোডাক্টের নাম</th>
                <th className="px-5 py-3 border-b-2 border-slate-200 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ইমপোর্ট (পিস)</th>
                <th className="px-5 py-3 border-b-2 border-slate-200 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">বিক্রি (পিস)</th>
                <th className="px-5 py-3 border-b-2 border-slate-200 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">স্টকে আছে (পিস)</th>
                <th className="px-5 py-3 border-b-2 border-slate-200 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">মূল্য (প্রতি পিস)</th>
              </tr>
            </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-4">লোড হচ্ছে...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-4">কোনো প্রোডাক্ট পাওয়া যায়নি।</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 border-b border-slate-200 text-sm">{product.name}</td>
                  <td className="px-5 py-4 border-b border-slate-200 text-sm">{product.importQuantity}</td>
                  <td className="px-5 py-4 border-b border-slate-200 text-sm">{product.soldQuantity}</td>
                  <td className="px-5 py-4 border-b border-slate-200 text-sm font-semibold">{product.stock}</td>
                  <td className="px-5 py-4 border-b border-slate-200 text-sm">৳ {product.price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for adding a new product */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="নতুন প্রোডাক্ট যোগ করুন"
      >
        <AddProductForm 
          onSuccess={() => {
            fetchProducts(); // রিফ্রেশ করার জন্য
          }}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}