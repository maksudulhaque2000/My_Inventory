// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { FiBox, FiTrendingUp, FiUsers, FiHome } from 'react-icons/fi';
import { Toaster } from 'react-hot-toast'; // <-- এটি ইমপোর্ট করুন

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Inventory Management',
  description: 'A simple inventory management app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-800`}>
        <Toaster position="top-center" reverseOrder={false} /> {/* <-- এটি যোগ করুন */}
        <div className="flex">
          <aside className="w-64 h-screen bg-white shadow-md p-4 fixed"> {/* <-- সাইডবার ফিক্সড করা হয়েছে */}
            <h1 className="text-2xl font-bold text-blue-600 mb-8">আমার প্রতিষ্ঠান</h1>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="flex items-center p-2 text-lg text-slate-700 hover:bg-blue-50 rounded-lg transition-colors">
                <FiHome className="mr-3" /> ড্যাশবোর্ড
              </Link>
              <Link href="/products" className="flex items-center p-2 text-lg text-slate-700 hover:bg-blue-50 rounded-lg transition-colors">
                <FiBox className="mr-3" /> প্রোডাক্টস
              </Link>
              <Link href="/sales" className="flex items-center p-2 text-lg text-slate-700 hover:bg-blue-50 rounded-lg transition-colors">
                <FiTrendingUp className="mr-3" /> সেলস
              </Link>
              <Link href="/customers" className="flex items-center p-2 text-lg text-slate-700 hover:bg-blue-50 rounded-lg transition-colors">
                <FiUsers className="mr-3" /> কাস্টমার
              </Link>
            </nav>
          </aside>
          <main className="flex-1 p-8 ml-64"> {/* <-- কন্টেন্টের জন্য মার্জিন যোগ করা হয়েছে */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}