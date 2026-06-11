"use client";

import ChatInput from "@/components/chat/chat-input";
import { startConversationAction } from "@/lib/actions/chat";
import { useAuth } from "@/context/auth-context";

export default function Home() {
  const { token } = useAuth();

  const startConversation = async (message: string) => {
    if (!token) return;
    const res = await startConversationAction(
      { first_message: message },
      token,
    );

    if (res.success) {
      console.log("Conversation ID:", res.data.id);
    } else {
      console.error(res.error);
    }
  };

  return (
    <div>
      <aside>
        <nav></nav>
      </aside>

      <main>
        <header className="flex flex-row gap-8">
          <p>chat</p>
          <p>revue de presse</p>
        </header>

        <section></section>

        <ChatInput sendMessage={startConversation} />
      </main>
    </div>
  );
}
