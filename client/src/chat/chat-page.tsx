import { useContext, useEffect, useState } from "react";
import api from "../api";
import { AuthContext } from "../auth/auth-context";

interface Message {
    _id: string;
    sender: {_id: string, username: string}; // Add sender name
    receiver: string;
    content: string;
    createdAt: string;
  }

interface ChatProps {
  requester: string;
  otherUser: string;
  serviceId: string;
}

export default function ChatPage({ requester, otherUser, serviceId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const currentUserId = useContext(AuthContext).userId;

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/chat/messages/${requester}/${otherUser}/${serviceId}`);
      setMessages(res.data);
      console.log(requester);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [requester, otherUser, serviceId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await api.post("/chat/send", {
        sender: currentUserId,
        receiver: otherUser === currentUserId ? requester : otherUser,
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
    <div className="p-20 w-full flex flex-col gap-4">
    <div className="flex flex-col w-1/2 mx-auto border p-4 rounded-lg shadow-lg">
      <div className="overflow-y-auto border-b mb-2 p-2">
        {messages.map((msg) => (
            <div key={msg._id} className="mb-2">
            {/* Sender's name (aligned to left or right) */}
            <p className={`text-sm font-semibold mb-1 ${msg.sender._id === requester ? "text-right" : "text-left"}`}>
                {msg.sender.username}
            </p>
            
            {/* Message bubble */}
            <div className={`p-2 rounded-lg max-w-[75%] ${
                msg.sender._id === requester ? "bg-blue-500 text-white ml-auto" : "bg-gray-300 text-black"
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
          placeholder="Напишіть повідомлення..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={sendMessage}
        >
          Відправити
        </button>
      </div>
    </div>
    </div>
  );
}
