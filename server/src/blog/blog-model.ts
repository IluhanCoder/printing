import mongoose, { Schema } from "mongoose";
import { IImage, ImageSchema } from "../service/service-model";

export interface IBlog {
    name: string,
    content: string,
    images: IImage[]
}

export interface BlogCredentials {
    name: string,
    content: string,
    images: Express.Multer.File[]
}

const blogSchema: Schema = new Schema(
    {
      name: String,
      content: String,
      images: [ImageSchema]
    }
  );

const BlogModel = mongoose.model<IBlog>('Blog', blogSchema);

export default BlogModel;