import mongoose, { Schema, Document } from 'mongoose';

interface IPayment extends Document {
  status: boolean;
  useid: string;
  housingId:string;
}

const paymentSchema: Schema = new Schema({
  status: { type: Boolean, required: true },
  useid: { type: String, required: true },
  housingId: { type: String, required: true },
  ownerId: { type: String, required: true },
});

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
