// External Libraries
import Markdown from "react-markdown";

// Icons
import { BotIcon, UserIcon } from "../icons";

// Utilities & Libs
import { cn, formatHourMinutes } from "@/lib/utils";

// Types & Validation
import { ChatMessage } from "@/lib/validation/chat";

interface MessageProps {
  message: ChatMessage;
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        "flex gap-x-2.5 ",
        isUser ? "flex-row justify-end" : "flex-row-reverse justify-end",
      )}
    >
      {/* bloc message */}
      <div
        className={cn(
          "flex flex-col gap-y-4 rounded-lg p-4 max-w-2xl",
          isUser ? "bg-dark text-primary-foreground" : "bg-secondary-light",
        )}
      >
        {/* texte */}
        <span className="sr-only">{isUser ? "Vous :" : "L'IA :"}</span>

        {isUser ? (
          <p className="text-primary-foreground">{message.content}</p>
        ) : (
          <Markdown>{message.content}</Markdown>
        )}

        {/* heure */}
        <time
          className={cn(
            "text-xs",
            isUser ? "text-secondary-light" : "text-subtle",
          )}
        >
          {formatHourMinutes(message.timestamp)}
        </time>
      </div>

      {/* bloc avatar */}
      <div
        className={cn(
          "rounded-full size-8 flex justify-center items-center",
          isUser ? "bg-avatar" : "bg-secondary-light",
        )}
      >
        {isUser ? (
          <UserIcon
            className="size-4 text-primary-foreground"
            aria-hidden="true"
          />
        ) : (
          <BotIcon className="size-4 text-base" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
