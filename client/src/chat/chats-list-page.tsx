import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";
import { AuthContext } from "../auth/auth-context";

interface Conversation {
  userId: string;
  username: string;
  lastMessage: string;
  serviceId: string;
}

export default function ChatsListPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const navigate = useNavigate();
  const currentUser = useContext(AuthContext).userId; 

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get(`/chat/chats/${currentUser}`);
        setConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Your Conversations</h2>
      {conversations.length === 0 ? (
        <p className="text-gray-500">No conversations yet.</p>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => (
            <div key={conv.userId} className="p-4 bg-gray-200 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">{conv.username}</p>
                <p className="text-sm text-gray-600">Last message: {conv.lastMessage}</p>
              </div>
              <button
                onClick={() => navigate(`/chat/${currentUser}/${conv.userId}/${conv.serviceId}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Go to Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
