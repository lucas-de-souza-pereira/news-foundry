"use client";

import ChatInput from "@/components/chat/chat-input";
import {
  startConversationAction,
  getAllConversationAction,
  getConversationAction,
} from "@/lib/actions/chat";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { ConversationResponse } from "@/lib/actions/chat";
import Conversation from "@/components/chat/conversation";

export default function Home() {
  const { token } = useAuth();
  const [chats, setChats] = useState<ConversationResponse[]>([]);

  useEffect(() => {
    if (!token) return;

    const loadChats = async () => {
      const res = await getAllConversationAction(token);
      if (res.success) {
        setChats(res.data);
      } else {
        console.error(res.error);
      }
    };
    loadChats();
  }, [token]);

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

  // const handleSelectConversation =

  return (
    <div className="flex flex-row">
      <aside>
        <nav>
          <ul>
            {chats.map((c) => (
              <li key={c.id}>
                <Conversation conversation={c} />
              </li>
            ))}
          </ul>
        </nav>
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
