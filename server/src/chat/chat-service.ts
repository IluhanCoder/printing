import { IUser } from "../user/user-model";
import MessageModel, { IMessage } from "./chat-model";

export default new class ChatService {
  async sendMessage(senderId: string, receiverId: string, serviceId: string, content: string): Promise<IMessage> {
    const message = await MessageModel.create({
      sender: senderId,
      receiver: receiverId,
      service: serviceId,
      content,
    });
    return message;
  }

  async getMessages(userId1: string, userId2: string, serviceId: string): Promise<IMessage[]> {
    return await MessageModel.find({
      service: serviceId,
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ createdAt: 1 })
    .populate("sender", "username"); // Sort by time
  }

  async getUserChats(userId: string) {
    const messages = await MessageModel.find({
        $or: [{ sender: userId }, { receiver: userId }]
      })
        .populate<{ sender: IUser }>("sender", "username")  // Force sender to be IUser
        .populate<{ receiver: IUser }>("receiver", "username")
        .sort({ createdAt: -1 });
  
      const conversationsMap = new Map();
  
      messages.forEach(msg => {
        const otherUser = msg.sender._id.toString() === userId ? msg.receiver : msg.sender;
        if (!conversationsMap.has(otherUser._id.toString())) {
          conversationsMap.set(otherUser._id.toString(), {
            userId: otherUser._id,
            username: otherUser.username,
            serviceId: msg.service,  // No more 'username does not exist' error
            lastMessage: msg.content
          });
        }
      });
  
      return Array.from(conversationsMap.values());
  }
}();
