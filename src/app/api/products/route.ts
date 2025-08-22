import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import Sale from '@/models/Sale';

// সকল প্রোডাক্ট এবং তাদের স্টক গণনা করে পাঠানোর জন্য
export async function GET() {
  await dbConnect();
  try {
    const products = await Product.find({});
    const sales = await Sale.find({});

    const productsWithStock = products.map(product => {
      const soldQuantity = sales
        .filter(sale => sale.product.toString() === product._id.toString())
        .reduce((acc, sale) => acc + sale.quantity, 0);
      
      const stock = product.importQuantity - soldQuantity;

      return {
        _id: product._id,
        name: product.name,
        importQuantity: product.importQuantity,
        price: product.price,
        soldQuantity: soldQuantity,
        stock: stock,
      };
    });

    return NextResponse.json({ success: true, data: productsWithStock });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

// নতুন প্রোডাক্ট যোগ করার জন্য
export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}