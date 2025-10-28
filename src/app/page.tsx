// src/app/page.tsx
import { FiArchive, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import { getDashboardSummary } from '@/lib/dashboardService';

// Force this page to be dynamic (server-rendered at request time)
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Call the service directly instead of making an HTTP request
  const data = await getDashboardSummary();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">ড্যাশবোর্ড</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Stock Value Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4 transition hover:shadow-lg hover:-translate-y-1 transform duration-300">
          <div className="bg-blue-100 p-3 rounded-full">
            <FiArchive className="text-blue-600 text-2xl" />
          </div>
          <div>
            <p className="text-slate-500">মোট স্টকের মূল্য</p>
            <p className="text-2xl font-bold text-slate-800">৳ {data.totalStockValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Today's Sales Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4 transition hover:shadow-lg hover:-translate-y-1 transform duration-300">
          <div className="bg-green-100 p-3 rounded-full">
            <FiDollarSign className="text-green-600 text-2xl" />
          </div>
          <div>
            <p className="text-slate-500">আজকের সেল</p>
            <p className="text-2xl font-bold text-slate-800">৳ {data.todaySales.toLocaleString()}</p>
          </div>
        </div>

        {/* Total Due Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4 transition hover:shadow-lg hover:-translate-y-1 transform duration-300">
          <div className="bg-red-100 p-3 rounded-full">
            <FiAlertCircle className="text-red-600 text-2xl" />
          </div>
          <div>
            <p className="text-slate-500">মোট বাকি</p>
            <p className="text-2xl font-bold text-slate-800">৳ {data.totalDue.toLocaleString()}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
