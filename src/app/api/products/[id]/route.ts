import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

type Params = {
    params: {
        id: string;
    }
}

// নির্দিষ্ট একটি প্রোডাক্টের তথ্য পাওয়ার জন্য
export async function GET(request: Request, { params }: Params) {
  await dbConnect();
  try {
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

// একটি প্রোডাক্ট আপডেট করার জন্য
export async function PUT(request: Request, { params }: Params) {
  await dbConnect();
  try {
    const body = await request.json();
    const product = await Product.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

// একটি প্রোডাক্ট ডিলিট করার জন্য
export async function DELETE(request: Request, { params }: Params) {
  await dbConnect();
  try {
    const deletedProduct = await Product.findByIdAndDelete(params.id);
    if (!deletedProduct) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}