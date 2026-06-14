"use client";

import { useAuth } from "./auth-context";
import { Chat } from "@/lib/validation/chat";
import { useContext, useEffect, useState, createContext } from "react";
import { getAllChatAction } from "@/lib/actions/chat";

interface ChatContextType {
  chats: Chat[];
  addChat: (newChat: Chat) => void;
  refreshChats: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);

  const refreshChats = async () => {
    if (!token) return;
    const res = await getAllChatAction(token);
    if (res.success) {
      setChats(res.data);
    } else {
      console.error(res.error);
    }
  };

  useEffect(() => {
    refreshChats();
  }, [token]);

  const addChat = (newChat: Chat) => {
    console.log("1. addChat appelé avec :", newChat);
    setChats((prev) => {
      const nextChats = [newChat, ...prev];
      console.log("2. Prochain état des chats :", nextChats);
      return nextChats;
    });
  };

  return (
    <ChatContext.Provider value={{ chats, refreshChats, addChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChats() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChats must be used within an ChatProvider");
  }
  return context;
}
