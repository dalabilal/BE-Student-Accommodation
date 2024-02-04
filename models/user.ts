import mongoose, { Document, Model } from 'mongoose';

export interface UserAttributes {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
  status : string;
}

export interface UserDocument extends UserAttributes, Document {}

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: {
    type :String,
    unique: true,
    required: true,
  } ,
  password: {
    type: String,
    required: true,
  },
  phoneNumber: String,
  role: String, // Include 'role' field in the userSchema
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending',
  },
});

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);

export default User;
