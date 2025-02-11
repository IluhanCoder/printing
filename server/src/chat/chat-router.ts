import { Router } from "express";
import chatController from "./chat-controller";

const ChatRouter = Router();

ChatRouter.post("/send", chatController.sendMessage);
ChatRouter.get("/messages/:user1/:user2/:service", chatController.getMessages);
ChatRouter.get("/chats/:userId", chatController.getUserChats);

export default ChatRouter;