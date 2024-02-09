import mongoose, { Document, Schema } from 'mongoose';
import { buffer } from 'stream/consumers';

interface HousingAttributes {
  name: string;
  phoneNumber: string;
  location: string;
  rooms: number;
  university: string;
  description: string;
  image : string;
  ownerId : any;
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
  image: {
    type : String ,
    required: true,
  },
  ownerId: {
    type : String ,
  }
});

const Housing = mongoose.model<HousingDocument>('Housing', housingSchema);

export default Housing;
