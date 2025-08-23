// src/app/products/page.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import AddProductForm from '@/components/AddProductForm';
import EditProductForm from '@/components/EditProductForm';
import Spinner from '@/components/Spinner';

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
  const [modalContent, setModalContent] = useState<'add' | 'edit' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (error) {
      toast.error("প্রোডাক্ট আনতে সমস্যা হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openModal = (type: 'add' | 'edit', product: Product | null = null) => {
    setModalContent(type);
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setModalContent(null);
    setSelectedProduct(null);
  };

  // আসল ডিলিট অপারেশন চালানোর জন্য ফাংশন
  const performDelete = async (productId: string) => {
    const toastId = toast.loading('ডিলিট করা হচ্ছে...');
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('ডিলিট করতে ব্যর্থ!');
      toast.success('প্রোডাক্ট সফলভাবে ডিলিট করা হয়েছে!', { id: toastId });
      fetchProducts(); // Refresh the list
    } catch (error: unknown) {
      if (error instanceof Error) {
    toast.error(error.message, { id: toastId });
  } else {
    toast.error('An unknown error occurred', { id: toastId });
  }
    }
  };
  
  // handleDelete ফাংশনটি এখন একটি কাস্টম টোস্ট দেখাবে
  const handleDelete = (productId: string, productName: string) => {
    toast((t) => (
      <div className="flex flex-col items-center gap-4 p-2">
        <div className="text-center">
          <p className="font-bold text-slate-800">আপনি কি নিশ্চিত?</p>
          <p className="text-sm text-slate-600">
            আপনি <span className="font-semibold">{productName}</span> প্রোডাক্টটি মুছে ফেলতে চান?
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              performDelete(productId);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
          >
            হ্যাঁ, নিশ্চিত
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md text-sm hover:bg-slate-300"
          >
            না, বাতিল
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">প্রোডাক্ট লিস্ট</h1>
        <button onClick={() => openModal('add')} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <FiPlus />
          <span>নতুন প্রোডাক্ট</span>
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-5 py-3 border-b-2 border-slate-200 text-left font-semibold text-slate-600 uppercase">নাম</th>
              <th className="px-5 py-3 border-b-2 border-slate-200 text-left font-semibold text-slate-600 uppercase">ইমপোর্ট</th>
              <th className="px-5 py-3 border-b-2 border-slate-200 text-left font-semibold text-slate-600 uppercase">বিক্রি</th>
              <th className="px-5 py-3 border-b-2 border-slate-200 text-left font-semibold text-slate-600 uppercase">স্টক</th>
              <th className="px-5 py-3 border-b-2 border-slate-200 text-left font-semibold text-slate-600 uppercase">মূল্য</th>
              <th className="px-5 py-3 border-b-2 border-slate-200 text-left font-semibold text-slate-600 uppercase">একশন</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6}><Spinner /></td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-4 font-bold text-xl text-red-600">কোনো প্রোডাক্ট পাওয়া যায়নি।</td></tr>
            ) : (products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 border-b border-slate-200 text-sm font-semibold text-slate-800">{product.name}</td>
                  <td className="px-5 py-4 border-b border-slate-200 text-sm font-semibold text-slate-800">{product.importQuantity}</td>
                  <td className="px-5 py-4 border-b border-slate-200 text-sm font-semibold text-slate-800">{product.soldQuantity}</td>
                  <td className="px-5 py-4 border-b border-slate-200 text-sm font-semibold text-slate-800">{product.stock}</td>
                  <td className="px-5 py-4 border-b border-slate-200 text-sm font-semibold text-slate-800">৳ {product.price}</td>
                  <td className="px-5 py-4 border-b border-slate-200 text-sm font-semibold text-slate-800">
                    <div className="flex space-x-3">
                      <button onClick={() => openModal('edit', product)} className="text-blue-600 hover:text-blue-800"><FiEdit size={18} /></button>
                      {/* onClick ইভেন্টটি এখন product.name পাস করছে */}
                      <button onClick={() => handleDelete(product._id, product.name)} className="text-red-600 hover:text-red-800"><FiTrash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalContent !== null} onClose={closeModal} title={<span className="text-slate-800">
      {modalContent === 'add' ? 'নতুন প্রোডাক্ট' : 'প্রোডাক্ট এডিট করুন'}
    </span>}>
        {modalContent === 'add' && <AddProductForm onSuccess={fetchProducts} onClose={closeModal} />}
        {modalContent === 'edit' && selectedProduct && <EditProductForm product={selectedProduct} onSuccess={fetchProducts} onClose={closeModal} />}
      </Modal>
    </div>
  );
}