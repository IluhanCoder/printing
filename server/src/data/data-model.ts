import mongoose, { Schema, Document } from 'mongoose';

export interface IData extends Document {
  name: string,
  desc: string,
  dataType: 'material' | 'technology' | 'processing'
}

export interface DataCredentials {
    name: string,
    desc: string,
    dataType: string
}

const dataSchema: Schema = new Schema(
  {
    name: String,
    desc: String,
    dataType: {
        type: String,
        enum: ['material', 'technology', 'processing'],
        required: true
      },
  }
);

// Експортуємо модель
const DataModel = mongoose.model<IData>('Data', dataSchema);

export default DataModel;
