"use client";

// React & Hooks
import { use, useEffect, useState } from "react";

// Components
import ChatSection from "@/components/chat/chat-section";
import ChatInput from "@/components/chat/chat-input";

// Contexts
import { useAuth } from "@/context/auth-context";

// Actions
import { sendMessageAction, getChatAction } from "@/lib/actions/chat";

// Types
import {
  ChatDetail,
  ChatMessage,
  MessageSendRequest,
} from "@/lib/validation/chat";
import Link from "next/link";
import { APP_ROUTES } from "@/lib/routes";

export default function ChatDetailsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { token } = useAuth();
  const resolvedParams = use(params);
  const chatId = resolvedParams.id;

  const [chat, setChat] = useState<ChatDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const loadChat = async () => {
      setLoading(true);
      const res = await getChatAction({ chat_id: chatId }, token);
      if (res.success) {
        setChat(res.data);
      } else {
        setError(res.error);
      }
      setLoading(false);
    };

    loadChat();
  }, [token, chatId]);

  const handleSendMessage = async (message: string) => {
    if (!token) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    setChat((prevChat) => {
      if (!prevChat) return null;
      return {
        ...prevChat,
        history: [...prevChat.history, userMessage],
      };
    });

    const request: MessageSendRequest = {
      chat_id: chatId,
      content: message,
    };
    const res = await sendMessageAction(request, token);
    if (res.success) {
      setChat((prevChat) => {
        if (!prevChat) return null;

        const agentMessage = res.data.response;
        return {
          ...prevChat,
          history: [...prevChat.history, agentMessage],
        };
      });
    } else {
      console.error(res.error);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Erreur: {error}</div>;
  }

  return (
    <div>
      <header className="flex flex-row gap-8">
        <Link href={APP_ROUTES.HOME}>Nouvelle Discussion</Link>
      </header>

      {token ? (
        <ChatSection history={chat?.history ?? []} />
      ) : (
        <div>Connexion en cours...</div>
      )}

      <ChatInput sendMessage={handleSendMessage} />
    </div>
  );
}
