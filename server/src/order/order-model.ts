import mongoose, { Schema, Document } from 'mongoose';

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
  status: 'pending' | 'accepted' | 'payed' | 'sent' | 'recieved';
  createdAt: Date;
  updatedAt: Date;
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
      enum: ['pending', 'accepted', 'payed', 'sent', 'recieved'],
      default: 'pending'
    }
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model<IOrder>('Order', orderSchema);
export default OrderModel;
