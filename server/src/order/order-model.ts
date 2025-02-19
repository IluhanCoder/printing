import mongoose, { Schema, Document } from 'mongoose';
import { IService } from '../service/service-model';
import { IData } from '../data/data-model';
import { IUser } from '../user/user-model';

// Define an interface for the file data stored in the order.
export interface IOrderFile {
  data: Buffer;
  contentType: string;
}

// Define the Order interface.
export interface IOrder extends Document {
  desc: string;
  adress: string;
  file: IOrderFile;
  service: mongoose.Types.ObjectId;
  processing: mongoose.Types.ObjectId;
  from: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | "money_sent" | 'payed' | 'sent' | 'received';
  createdAt: Date;
  updatedAt: Date;
  feedback?: Feedback,
  budget?: number,
  price?: number
}

export interface OrderResponse {
  desc: string;
  adress: string;
  file: IOrderFile;
  service: IService;
  processing: IData;
  from: IUser;
  status: 'pending' | 'accepted' | 'money_sent' | 'payed' | 'sent' | 'received';
  createdAt: Date;
  updatedAt: Date;
  budget?: number;
  price?: number;
}

export interface Feedback {
  text: string;
  points: number; // Rating from 1 to 5
  from: { _id: string; username: string };
}

// Define the OrderCredentials interface (for creating a new order)
export interface OrderCredentials {
  desc: string;
  processing: string;
  adress: string;
  file: {
    data: Buffer;
    contentType: string;
  };
  service: string;
  from: mongoose.Types.ObjectId;
  budget?: number;
}

const OrderFileSchema: Schema = new Schema({
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
});

const orderSchema: Schema = new Schema(
  {
    desc: { type: String, required: true },
    file: { type: OrderFileSchema, required: true },
    adress: { type: String, required: true },
    service: { type: mongoose.Types.ObjectId, ref: "Service", required: true },
    processing: { type: mongoose.Types.ObjectId, ref: "Data", required: true },
    from: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'money_sent', 'payed', 'sent', 'received'],
      default: 'pending'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    feedback: {
      text: { type: String },
      points: { type: Number, min: 1, max: 5 },
    },
    budget: { type: Number, required: false },
    price: { type: Number, required: false }
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model<IOrder>('Order', orderSchema);
export default OrderModel;
