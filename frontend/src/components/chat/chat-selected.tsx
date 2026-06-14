// Next.js
import Link from "next/link";

// UI Components
import { Button } from "@/components/ui/button";

// Config & Routes
import { APP_ROUTES } from "@/lib/routes";

// Utils
import { formatShortFrenchDate } from "@/lib/utils";

// Types
import { Chat } from "@/lib/validation/chat";

interface ChatProps {
  chat: Chat;
}

export default function ChatSelected({ chat }: ChatProps) {
  return (
    <Button asChild>
      <Link href={APP_ROUTES.CHAT(chat.id)}>
        <p>Discussion du</p>
        <p>{formatShortFrenchDate(chat.created_at)}</p>
      </Link>
    </Button>
  );
}
