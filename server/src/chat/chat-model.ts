import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;  // User who sent the message
  receiver: mongoose.Types.ObjectId; // User who receives the message
  service: mongoose.Types.ObjectId;  // Service related to the chat
  content: string;
  createdAt: Date;
}

const messageSchema: Schema = new Schema(
  {
    sender: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    service: { type: mongoose.Types.ObjectId, ref: "Service", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model<IMessage>("Message", messageSchema);
export default MessageModel;
