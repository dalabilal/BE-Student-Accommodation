import mongoose, { Document, Schema } from 'mongoose';

interface HousingAttributes {
  name: string;
  phoneNumber: string;
  location: string;
  rooms: number;
  university: string;
  description: string;
  files: string[];
}

interface HousingDocument extends Document, HousingAttributes {}

const housingSchema: Schema<HousingDocument> = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  rooms: {
    type: Number,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  files: {
    type: [Object],
    required: true,
  },
});

const Housing = mongoose.model<HousingDocument>('Housing', housingSchema);

export default Housing;
