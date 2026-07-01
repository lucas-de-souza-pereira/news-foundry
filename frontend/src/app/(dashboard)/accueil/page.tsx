"use client";

// React & Hooks
import { useState } from "react";

// Next.js
import { useRouter } from "next/navigation";

// Components
import ChatInput from "@/components/chat/chat-input";
import BotIntroduction from "@/components/home/bot-introduction";
import LoadingRing from "@/components/shared/states/loading-ring";

// Contexts
import { useAuth } from "@/context/auth-context";
import { useChats } from "@/context/chat-context";

// Actions
import { startChatAction } from "@/lib/actions/chat";

// Routes & Config
import { APP_ROUTES } from "@/lib/routes";

// Types & Validation
import { ChatCreateResquest } from "@/lib/validation/chat";

export default function Home() {
  const { token } = useAuth();
  const router = useRouter();
  const { addChat } = useChats();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartNewChat = async (message: string) => {
    if (!token) return;

    setIsSubmitting(true);
    setError(null);

    const request: ChatCreateResquest = {
      first_message: message,
    };

    const res = await startChatAction(request, token);

    if (res.success) {
      addChat(res.data);
      setIsSubmitting(false);
      router.push(APP_ROUTES.CHAT(res.data.id));
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 bg-background flex items-center justify-center">
        <h1 className="sr-only">{"Page d'accueil"}</h1>
        {isSubmitting ? <LoadingRing /> : <BotIntroduction />}
      </div>

      <div className="bg-card px-18 py-4.25 w-full flex flex-col gap-y-3">
        <ChatInput
          sendMessage={handleStartNewChat}
          isSubmitting={isSubmitting}
          isNewChat={true}
        />
        {error && (
          <p className="text-destructive text-center text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}
