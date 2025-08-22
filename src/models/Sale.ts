import mongoose, { Schema, Document } from 'mongoose';

export interface ISale extends Document {
  product: mongoose.Schema.Types.ObjectId;
  customer: mongoose.Schema.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  paymentStatus: 'Paid' | 'Due';
  saleDate: Date;
}

const SaleSchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Due'], required: true },
  saleDate: { type: Date, default: Date.now },
});

export default mongoose.models.Sale || mongoose.model<ISale>('Sale', SaleSchema);