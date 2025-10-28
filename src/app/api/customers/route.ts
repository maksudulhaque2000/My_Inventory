import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Customer from '@/models/Customer';

/**
 * @description
 * @method GET
 */
export async function GET() {
  await dbConnect();
  try {
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: customers });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

/**
 * @description
 * @method POST
 */
export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    if (!body.name || !body.phone) {
        return NextResponse.json({ success: false, error: 'Name and phone are required' }, { status: 400 });
    }
    const customer = await Customer.create(body);
    return NextResponse.json({ success: true, data: customer }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    if (error && typeof error === 'object' && 'code' in error) {
        if ((error as { code: unknown }).code === 11000) {
     return NextResponse.json({ success: false, error: 'This phone number is already registered.' }, { status: 409 });
        }
       }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}