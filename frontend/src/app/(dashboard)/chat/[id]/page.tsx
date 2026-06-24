"use client";
// next
import Link from "next/link";

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

// Routes
import { APP_ROUTES } from "@/lib/routes";
import SubhearderChat from "@/components/shared/header/subhearder-chat";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);
    setError(null);

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
      setIsSubmitting(false);
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
    <div className="flex flex-col h-full">
      {token ? (
        <ChatSection history={chat?.history ?? []} />
      ) : (
        <div>Connexion en cours...</div>
      )}

      <div className="bg-card px-18 py-4.25 w-full flex flex-col gap-y-3">
        <ChatInput
          sendMessage={handleSendMessage}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
