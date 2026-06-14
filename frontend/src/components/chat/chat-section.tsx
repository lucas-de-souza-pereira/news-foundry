// Components
import Message from "./message";

// Types
import { ChatMessage } from "@/lib/validation/chat";

interface ChatSectionProps {
  history: ChatMessage[];
}

export default function ChatSection({ history }: ChatSectionProps) {
  if (!history) {
    return <div></div>;
  }

  return (
    <div>
      {history.map((m, i) => (
        <Message key={`message-${i}`} message={m} />
      ))}
    </div>
  );
}
