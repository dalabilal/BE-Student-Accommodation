import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserAttributes {
  email: string;
  password: string; // Store the hashed password
  // Other user attributes...
}

export interface UserDocument extends UserAttributes, Document {
  // Define any additional methods or customizations here if needed
}

const userSchema = new mongoose.Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Other fields...
});

// Hash the password before saving the user to the database
userSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10); // Hash the password
    this.password = hashedPassword; // Set the hashed password to be stored
    next();
  } catch (error) {
    
  }
});

const Users: Model<UserDocument> = mongoose.model<UserDocument>('Users', userSchema);

export default Users;
