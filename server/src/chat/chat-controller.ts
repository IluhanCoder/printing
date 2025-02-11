import { Request, Response } from "express";
import chatService from "./chat-service";

export default new class ChatController {
    async sendMessage(req: Request, res: Response) {
        try {
            const { sender, receiver, service, content } = req.body;
            const message = await chatService.sendMessage(sender, receiver, service, content);
            res.status(200).json(message);
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    async getMessages(req: Request, res: Response) {
        try {
            const { user1, user2, service } = req.params;
            const messages = await chatService.getMessages(user1, user2, service);
            res.json(messages);
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    async getUserChats(req: Request, res: Response) {
        try {
            const {userId} = req.params;
            const chats = await chatService.getUserChats(userId);
            res.status(200).json(chats);
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }
}