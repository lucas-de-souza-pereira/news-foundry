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

  const loadChat = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    const res = await getChatAction({ chat_id: chatId }, token);
    if (res.success) {
      setChat(res.data);
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
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

    const previousHistory = chat?.history ?? [];

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
      setChat((prevChat) => {
        if (!prevChat) return null;
        return {
          ...prevChat,
          history: previousHistory,
        };
      });
      setError(
        res.error || "Une erreur est survenue lors de l'envoi du message.",
      );
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <h1 className="sr-only">Page de chat avec l'agent IA</h1>
      <ChatSection
        history={chat?.history ?? []}
        isLoading={loading}
        isSubmitting={isSubmitting}
        error={error}
        onRetry={loadChat}
      />
      <div className="bg-card px-18 py-4.25 w-full flex flex-col gap-y-3">
        <ChatInput
          sendMessage={handleSendMessage}
          isSubmitting={isSubmitting || loading}
        />
      </div>
    </div>
  );
}
