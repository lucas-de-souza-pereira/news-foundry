"use client";

import { useEffect, useState } from "react";
import { getConversationAction, ChatDetailResponse } from "@/lib/actions/chat";
import Message from "./message";

interface ChatSectionProps {
  token: string | null;
  chatId: number;
}

export default function ChatSection({ token, chatId }: ChatSectionProps) {
  const [chat, setChat] = useState<ChatDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !chatId) return;

    const loadChat = async () => {
      setLoading(true);
      const res = await getConversationAction(token, chatId);
      if (res.success) {
        setChat(res.data);
      } else {
        console.error(res.error);
      }
      setLoading(false);
    };

    loadChat();
  }, [token, chatId]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <div>chat-section for ID: {chatId}</div>
      {chat?.history.map((message, i) => (
        <Message key={`message-${i}`} message={message} />
      ))}
    </div>
  );
}
