import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Sale from '@/models/Sale';
import Product from '@/models/Product';

/**
 * @description
 * @method GET
 */
export async function GET() {
  await dbConnect();
  try {
    const sales = await Sale.find({})
      .populate('product', 'name price')
      .populate('customer', 'name phone')
      .sort({ saleDate: -1 });

    return NextResponse.json({ success: true, data: sales });
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
    const { product, customer, quantity, paymentStatus } = body;

    if (!product || !customer || !quantity || !paymentStatus) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const productData = await Product.findById(product);
    if (!productData) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    const salesOfProduct = await Sale.find({ product: productData._id });
    const soldQuantity = salesOfProduct.reduce((acc, sale) => acc + sale.quantity, 0);
    const currentStock = productData.importQuantity - soldQuantity;

    if (currentStock < quantity) {
        return NextResponse.json({ success: false, error: `Not enough stock. Only ${currentStock} items available.` }, { status: 400 });
    }

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