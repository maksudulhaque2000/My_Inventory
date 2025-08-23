import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  phone: string;
  address: string; // <-- নতুন ফিল্ড যোগ করা হয়েছে
}

const CustomerSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, trim: true }, // <-- নতুন ফিল্ড যোগ করা হয়েছে
}, {
  timestamps: true
});

export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);