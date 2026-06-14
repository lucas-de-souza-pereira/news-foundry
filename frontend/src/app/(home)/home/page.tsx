"use client";

// Components
import ChatInput from "@/components/chat/chat-input";

// Contexts
import { useAuth } from "@/context/auth-context";

// Actions
import { startChatAction } from "@/lib/actions/chat";

// Types
import { ChatCreateResquest } from "@/lib/validation/chat";

export default function Home() {
  const { token } = useAuth();

  const handleStartNewChat = async (message: string) => {
    if (!token) return;

    const resquest: ChatCreateResquest = {
      first_message: message,
    };

    const res = await startChatAction(resquest, token);

    if (res.success) {
      console.log("Conversation ID:", res.data.id);
    } else {
      console.error(res.error);
    }
  };

  return (
    <div className="flex flex-row">
      <header className="flex flex-row gap-8">
        <p>chat</p>
        <p>revue de presse</p>
      </header>
      <section></section>

      <ChatInput sendMessage={handleStartNewChat} />
    </div>
  );
}
