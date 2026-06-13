import { ChatMessage } from "@/lib/actions/chat";

interface MessageProps {
  message: ChatMessage;
}

export default function Message({ message }: MessageProps) {
  return (
    <div className="flex flex-row bg-amber-300">
      <p>{message.role}</p>
      <p>{message.content}</p>
      <p>{message.timestamp}</p>
    </div>
  );
}
