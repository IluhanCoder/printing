import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  cell: string;
  password: string | null;
  role: 'user' | 'admin' | 'specialist';
}

const userSchema: Schema = new Schema(
  {
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
  }
);

// Експортуємо модель
const User = mongoose.model<IUser>('User', userSchema);

export default User;
