import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import Sale from '@/models/Sale';

export async function getDashboardSummary() {
  await dbConnect();
  
  try {
    const products = await Product.find({});
    const sales = await Sale.find({});

    // 1. মোট স্টকের মূল্য গণনা
    const salesByProduct = sales.reduce((acc, sale) => {
        const productId = sale.product.toString();
        acc[productId] = (acc[productId] || 0) + sale.quantity;
        return acc;
    }, {} as Record<string, number>);

    const totalStockValue = products.reduce((total, product) => {
        const soldQuantity = salesByProduct[product._id.toString()] || 0;
        const stock = product.importQuantity - soldQuantity;
        return total + (stock * product.price);
    }, 0);

    // 2. আজকের সেল গণনা
    const today = new Date();
    today.setHours(0, 0, 0, 0); // দিনের শুরু
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // দিনের শেষ

    const todaySales = sales
      .filter(sale => {
        const saleDate = new Date(sale.saleDate);
        return saleDate >= today && saleDate < tomorrow;
      })
      .reduce((total, sale) => total + sale.totalPrice, 0);

    // 3. মোট বাকি টাকার পরিমাণ গণনা
    const totalDue = sales
      .filter(sale => sale.paymentStatus === 'Due')
      .reduce((total, sale) => total + sale.totalPrice, 0);

    return {
      totalStockValue,
      todaySales,
      totalDue,
    };
  } catch (error) {
    console.error('Dashboard summary error:', error);
    return {
      totalStockValue: 0,
      todaySales: 0,
      totalDue: 0,
    };
  }
}

