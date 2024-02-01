import mongoose, { Schema, Document } from 'mongoose';

interface ITerms extends Document {
      fees : number,
      term :string,
      housingId :string,
      ownerId : string
}

const termSchema: Schema = new Schema({
  fees: { type: Number, required: true },
  term: { type: String, required: true },
  housingId: { type: String, required: true },
  ownerId: { type: String, required: true }
});

const Term = mongoose.model<ITerms>('Terms', termSchema);

export default Term;
