// Components
import Message from "./message";

// Types
import { ChatMessage } from "@/lib/validation/chat";

interface ChatSectionProps {
  history: ChatMessage[];
}

export default function ChatSection({ history }: ChatSectionProps) {
  return (
    <div className="flex-1 bg-background flex flex-col gap-y-8 px-25 py-10 overflow-y-auto">
      {history.map((m, i) => (
        <Message key={`message-${i}`} message={m} />
      ))}
    </div>
  );
}
