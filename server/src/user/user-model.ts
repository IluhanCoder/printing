import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  cell: string;
  password: string | null;
  role: 'user' | 'admin' | 'specialist';
  cardNumber?: string; // New field for card number
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cell: { type: String, required: false, unique: true },
  role: {
    type: String,
    enum: ['user', 'admin', 'specialist'],
    required: true,
    default: 'user',
  },
  cardNumber: { type: String, required: false }, // New cardNumber field
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
