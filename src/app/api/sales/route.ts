import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Sale from '@/models/Sale';
import Product from '@/models/Product';
import Customer from '@/models/Customer';

/**
 * @description সকল সেলস রেকর্ড এবং সংশ্লিষ্ট প্রোডাক্ট ও কাস্টমারের তথ্য পাওয়ার জন্য
 * @method GET
 */
export async function GET() {
  await dbConnect();
  try {
    const sales = await Sale.find({})
      .populate('product', 'name price') // প্রোডাক্টের নাম ও মূল্য যুক্ত করবে
      .populate('customer', 'name phone') // কাস্টমারের নাম ও ফোন যুক্ত করবে
      .sort({ saleDate: -1 }); // নতুন সেলগুলো আগে দেখাবে

    return NextResponse.json({ success: true, data: sales });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

/**
 * @description নতুন সেল রেকর্ড তৈরি করার জন্য
 * @method POST
 */
export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { product, customer, quantity, paymentStatus } = body;

    // প্রয়োজনীয় তথ্য আছে কিনা তা পরীক্ষা করা
    if (!product || !customer || !quantity || !paymentStatus) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // প্রোডাক্টের স্টক আছে কিনা তা পরীক্ষা করা
    const productData = await Product.findById(product);
    if (!productData) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    // বর্তমান স্টক গণনা
    const salesOfProduct = await Sale.find({ product: productData._id });
    const soldQuantity = salesOfProduct.reduce((acc, sale) => acc + sale.quantity, 0);
    const currentStock = productData.importQuantity - soldQuantity;

    if (currentStock < quantity) {
        return NextResponse.json({ success: false, error: `Not enough stock. Only ${currentStock} items available.` }, { status: 400 });
    }

    // মোট মূল্য গণনা
    const totalPrice = productData.price * quantity;

    const newSale = await Sale.create({
      product,
      customer,
      quantity,
      paymentStatus,
      totalPrice,
    });

    return NextResponse.json({ success: true, data: newSale }, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}