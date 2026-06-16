// Next.js
import Link from "next/link";

// Config & Routes
import { APP_ROUTES } from "@/lib/routes";

// Utils
import { cn, formatShortFrenchDate } from "@/lib/utils";

// Types
import { Chat } from "@/lib/validation/chat";

interface ChatProps {
  chat: Chat;
  isActive: Boolean;
}

export default function ChatListItem({ chat, isActive }: ChatProps) {
  return (
    <Link
      href={APP_ROUTES.CHAT(chat.id)}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex flex-col gap-y-1 py-5.25 px-6 text-left border-b border-border",
        isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent",
      )}
      aria-label={`Lien vers la conversation du ${formatShortFrenchDate(chat.created_at)}`}
    >
      <span className="text-base text-body">Discussion du</span>
      <time className="text-xs text-subtle">
        {formatShortFrenchDate(chat.created_at)}
      </time>
    </Link>
  );
}
