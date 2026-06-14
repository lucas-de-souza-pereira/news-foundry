// Components
import Message from "./message";

// Types
import { ChatMessage } from "@/lib/validation/chat";

interface ChatSectionProps {
  history: ChatMessage[];
}

export default function ChatSection({ history }: ChatSectionProps) {
  return (
    <div>
      {history.map((m, i) => (
        <Message key={`message-${i}`} message={m} />
      ))}
    </div>
  );
}
