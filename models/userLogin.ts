import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserAttributes {
  email: string;
  password: string;
  role: string; // Add the role field
  verificationCode?: any; // Make sure verificationCode is optional
  loginAttempts: number;
  lastLoginAttempt: Date | null;
}

export interface UserDocument extends UserAttributes, Document {}

const userSchema = new mongoose.Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }, 
  verificationCode: {type: String,default: null,}, 
  loginAttempts: { type: Number, default: 0 },
  lastLoginAttempt: { type: Date, default: null as Date | null },
});

userSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    // Handle error
  }
});

const Users: Model<UserDocument> = mongoose.model<UserDocument>('Users', userSchema);

export default Users;
