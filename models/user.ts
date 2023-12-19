import mongoose, { Document, Model } from 'mongoose';

export interface UserAttributes {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string; // Add 'role' property to the UserAttributes interface
}

export interface UserDocument extends UserAttributes, Document {}

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  phoneNumber: String,
  role: String, // Include 'role' field in the userSchema
});

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);

export default User;
