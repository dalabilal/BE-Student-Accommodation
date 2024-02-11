import mongoose, { Schema, Document } from 'mongoose';

interface IPayment extends Document {
  holdername: string;
  cardnum: { iv: string; encryptedText: string; tag: string };
  cvv: { iv: string; encryptedText: string; tag: string };
  expDate: string;
  status: boolean;
  useid: string;
  housingId:string;
}

const paymentSchema: Schema = new Schema({
  holdername: { type: String,  },
  cardnum: {
    iv: { type: String,  },
    encryptedText: { type: String,  },
    tag: { type: String,  },
  },
  cvv: {
    iv: { type: String,},
    encryptedText: { type: String,},
    tag: { type: String},
  },
  expDate: { type: String,  },
  status: { type: Boolean,  },
  useid: { type: String,  required: true },
  housingId: { type: String, required: true },
  ownerId: { type: String, required: true },
});

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
