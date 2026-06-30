import { ErrorState } from "@/components/shared/states/error-state";
import { BotIcon } from "@/components/icons";

// Components
import Message from "./message";
import { MessageSkeleton } from "./message-skeleton";
import { TypingIndicator } from "./typing-indicator";

// Types
import { ChatMessage } from "@/lib/validation/chat";

interface ChatSectionProps {
  history: ChatMessage[];
  isLoading?: boolean;
  isSubmitting?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function ChatSection({
  history,
  isLoading,
  isSubmitting,
  error,
  onRetry,
}: ChatSectionProps) {
  if (error) {
    return (
      <div className="flex-1 bg-background flex flex-col justify-center items-center min-h-0">
        <ErrorState message={error} reset={onRetry} />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background flex flex-col gap-y-8 px-25 py-10 overflow-y-auto min-h-0 ">
      {isLoading ? (
        <>
          <MessageSkeleton isUser={true} />
          <MessageSkeleton isUser={false} />
        </>
      ) : (
        <>
          {history.map((m, i) => (
            <Message key={`message-${i}`} message={m} />
          ))}
          {isSubmitting && <TypingIndicator />}
        </>
      )}
    </div>
  );
}
