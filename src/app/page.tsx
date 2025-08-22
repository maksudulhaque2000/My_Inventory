// src/app/page.tsx
import { FiArchive, FiDollarSign, FiAlertCircle } from 'react-icons/fi';

// API থেকে ডেটা আনার জন্য এই ফাংশনটি আপডেট করা হয়েছে
async function getDashboardData() {
  try {
    // এখানে localhost ব্যবহার না করে relative path ব্যবহার করা ভালো
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard-summary`, {
      cache: 'no-store', // সবসময় লেটেস্ট ডেটা দেখানোর জন্য
    });

    if (!res.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    const result = await res.json();
    return result.data;

  } catch (error) {
    console.error(error);
    // ডেটা আনতে ব্যর্থ হলে ডিফল্ট ভ্যালু রিটার্ন করবে
    return {
      totalStockValue: 0,
      todaySales: 0,
      totalDue: 0,
    };
  }
}

// .env.local ফাইলে নিচের লাইনটি যোগ করুন
// NEXT_PUBLIC_API_URL=http://localhost:3000

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className='bg-slate-50 text-slate-800'>
      <h1 className="text-3xl font-bold mb-6">ড্যাশবোর্ড</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Stock Value Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4 transition hover:shadow-lg hover:-translate-y-1 transform duration-300">
          <div className="bg-blue-100 p-3 rounded-full">
            <FiArchive className="text-blue-600 text-2xl" />
          </div>
          <div>
            <p className="text-slate-500">মোট স্টকের মূল্য</p>
            <p className="text-2xl font-bold">৳ {data.totalStockValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Today's Sales Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4 transition hover:shadow-lg hover:-translate-y-1 transform duration-300">
          <div className="bg-green-100 p-3 rounded-full">
            <FiDollarSign className="text-green-600 text-2xl" />
          </div>
          <div>
            <p className="text-slate-500">আজকের সেল</p>
            <p className="text-2xl font-bold">৳ {data.todaySales.toLocaleString()}</p>
          </div>
        </div>

        {/* Total Due Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4 transition hover:shadow-lg hover:-translate-y-1 transform duration-300">
          <div className="bg-red-100 p-3 rounded-full">
            <FiAlertCircle className="text-red-600 text-2xl" />
          </div>
          <div>
            <p className="text-slate-500">মোট বাকি</p>
            <p className="text-2xl font-bold">৳ {data.totalDue.toLocaleString()}</p>
          </div>
        </div>

      </div>
    </div>
  );
}