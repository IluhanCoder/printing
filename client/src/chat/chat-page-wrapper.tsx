import { useParams } from "react-router-dom";
import ChatPage from "./chat-page";

export default function ChatPageWrapper() {
  const { requester, otherUser, serviceId } = useParams();

  if (!requester || !otherUser || !serviceId) {
    return <p>Error: Missing parameters</p>;
  }

  return <ChatPage requester={requester} otherUser={otherUser} serviceId={serviceId} />;
}
