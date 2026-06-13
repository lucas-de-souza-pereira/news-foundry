import Link from "next/link";
import { Button } from "../ui/button";
import { formatShortFrenchDate } from "@/lib/utils";

interface ConversationType {
  id: number;
  user_id: number;
  created_at: string;
}

interface ConversationProps {
  conversation: ConversationType;
}

export default function Conversation({ conversation }: ConversationProps) {
  console.log("conversation", conversation);
  return (
    <Link href={`/home/${conversation.id}`}>
      <Button>
        <p>Discussion du</p>
        <p>{formatShortFrenchDate(conversation.created_at)}</p>
      </Button>
    </Link>
  );
}
