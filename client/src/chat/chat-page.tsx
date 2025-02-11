import { useEffect, useState } from "react";
import api from "../api";

interface Message {
    _id: string;
    sender: {_id: string, username: string}; // Add sender name
    receiver: string;
    content: string;
    createdAt: string;
  }

interface ChatProps {
  currentUser: string;
  otherUser: string;
  serviceId: string;
}

export default function ChatPage({ currentUser, otherUser, serviceId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/chat/messages/${currentUser}/${otherUser}/${serviceId}`);
      setMessages(res.data);
      console.log(currentUser);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [currentUser, otherUser, serviceId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await api.post("/chat/send", {
        sender: currentUser,
        receiver: otherUser,
        service: serviceId,
        content: newMessage,
      });
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col max-w-lg mx-auto border p-4 rounded-lg shadow-lg">
      <div className="h-80 overflow-y-auto border-b mb-2 p-2">
        {messages.map((msg) => (
            <div key={msg._id} className="mb-2">
            {/* Sender's name (aligned to left or right) */}
            <p className={`text-sm font-semibold mb-1 ${msg.sender._id === currentUser ? "text-right" : "text-left"}`}>
                {msg.sender.username}
            </p>
            
            {/* Message bubble */}
            <div className={`p-2 rounded-lg max-w-[75%] ${
                msg.sender._id === currentUser ? "bg-blue-500 text-white ml-auto" : "bg-gray-300 text-black"
            }`}>
                <p>{msg.content}</p>
                <small className="block text-xs opacity-70 text-right">{new Date(msg.createdAt).toLocaleTimeString()}</small>
            </div>
            </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
