import mongoose, { Schema, Document } from 'mongoose';


export interface IImage {
  data: Buffer;
  contentType: string;
}

export interface IService extends Document {
  name: string,
  desc: string,
  material: mongoose.Types.ObjectId,
  technology: mongoose.Types.ObjectId,
  images: IImage[],
  user: mongoose.Types.ObjectId
}

export interface ServiceCredentials {
    name: string,
    desc: string,
    material: string,
    technology: string,
    images: Express.Multer.File[],
    user: string
}

export const ImageSchema: Schema = new Schema({
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
  });

const serviceSchema: Schema = new Schema(
  {
    name: String,
    desc: String,
    material: { type: mongoose.Types.ObjectId, ref: "Data" },
    technology: { type: mongoose.Types.ObjectId, ref: "Data" },
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    images: [ImageSchema]
  }
);

// Експортуємо модель
const ServiceModel = mongoose.model<IService>('Service', serviceSchema);

export default ServiceModel;
