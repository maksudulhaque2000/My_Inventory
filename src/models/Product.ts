import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  importQuantity: number;
  price: number;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  importQuantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
}, {
  timestamps: true
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);