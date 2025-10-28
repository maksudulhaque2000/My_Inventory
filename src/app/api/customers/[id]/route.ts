import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Customer from '@/models/Customer';

type Params = {
    params: Promise<{
        id: string;
    }>
}

// একটি কাস্টমার আপডেট করার জন্য
export async function PUT(request: Request, { params }: Params) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await request.json();
    const customer = await Customer.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

// একটি কাস্টমার ডিলিট করার জন্য
export async function DELETE(request: Request, { params }: Params) {
  await dbConnect();
  try {
    const { id } = await params;
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}