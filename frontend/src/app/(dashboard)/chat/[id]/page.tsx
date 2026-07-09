"use client";

// Next.js
import { notFound } from "next/navigation";

// React & Hooks
import { use, useEffect, useCallback, useState } from "react";

// Components
import ChatSection from "@/components/chat/chat-section";
import ChatInput from "@/components/chat/chat-input";

// Contexts
import { useAuth } from "@/context/auth-context";

// Actions
import { sendMessageAction, getChatAction } from "@/lib/actions/chat";

// Types & Validation
import {
  ChatDetail,
  ChatMessage,
  MessageSendRequest,
} from "@/lib/validation/chat";

export default function ChatDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { token } = useAuth();

  const resolvedParams = use(params);
  const rawId = resolvedParams.id;

  const isInvalidId = !/^\d+$/.test(rawId);
  const chatId = isInvalidId ? NaN : parseInt(rawId, 10);

  const [chat, setChat] = useState<ChatDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const loadChat = useCallback(async () => {
    if (!token || isInvalidId) return;
    const res = await getChatAction({ chat_id: chatId }, token);
    if (res.success) {
      setChat(res.data);
      setError(null);
    } else {
      console.log("Error fetching chat:", res);
      if (
        res.error === "Chat not found" ||
        res.error === "You do not have access to this chat"
      ) {
        setIsNotFound(true);
      } else {
        setError(res.error);
      }
    }
    setLoading(false);
  }, [token, chatId, isInvalidId]);

  useEffect(() => {
    Promise.resolve().then(() => {
      loadChat();
    });
  }, [loadChat]);

  if (isNotFound || isInvalidId) return notFound();

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    loadChat();
  };

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
      <h1 className="sr-only">{"Page de chat avec l'agent IA"}</h1>
      <ChatSection
        history={chat?.history ?? []}
        isLoading={loading}
        isSubmitting={isSubmitting}
        error={error}
        onRetry={handleRetry}
      />
      <div className="bg-card px-18 py-4.25 w-full flex flex-col gap-y-3">
        <div className="">
          <ChatInput
            sendMessage={handleSendMessage}
            isSubmitting={isSubmitting || loading}
          />
        </div>
      </div>
    </div>
  );
}
