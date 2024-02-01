import mongoose, { Schema, Document } from 'mongoose';

interface IPayment extends Document {
  holdername: string;
  cardnum: { iv: string; encryptedText: string; tag: string };
  cvv: { iv: string; encryptedText: string; tag: string };
  expDate: string;
  useid: string;
  housingId:string;
}

const paymentSchema: Schema = new Schema({
  holdername: { type: String, required: true },
  cardnum: {
    iv: { type: String, required: true },
    encryptedText: { type: String, required: true },
    tag: { type: String, required: true },
  },
  cvv: {
    iv: { type: String, required: true },
    encryptedText: { type: String, required: true },
    tag: { type: String, required: true },
  },
  expDate: { type: String, required: true },
  useid: { type: String, required: true },
  housingId: { type: String, required: true },
  ownerId: { type: String, required: true },
});

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
