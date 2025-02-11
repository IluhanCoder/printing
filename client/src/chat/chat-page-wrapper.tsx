import { useParams } from "react-router-dom";
import ChatPage from "./chat-page";

export default function ChatPageWrapper() {
  const { currentUser, otherUser, serviceId } = useParams();

  if (!currentUser || !otherUser || !serviceId) {
    return <p>Error: Missing parameters</p>;
  }

  return <ChatPage currentUser={currentUser} otherUser={otherUser} serviceId={serviceId} />;
}
