"use client";

// React & Hooks
import {
  useContext,
  useEffect,
  useState,
  createContext,
  useCallback,
} from "react";

// Contexts
import { useAuth } from "./auth-context";

// Actions
import { getAllChatAction } from "@/lib/actions/chat";

// Types & Validation
import { Chat } from "@/lib/validation/chat";

interface ChatContextType {
  chats: Chat[];
  addChat: (newChat: Chat) => void;
  refreshChats: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);

  const refreshChats = useCallback(async () => {
    if (!token) return;
    const res = await getAllChatAction(token);
    if (res.success) {
      setChats(res.data);
    } else {
      console.error(res.error);
    }
  }, [token]);

  useEffect(() => {
    Promise.resolve().then(() => {
      refreshChats();
    });
  }, [refreshChats]);

  const addChat = (newChat: Chat) => {
    setChats((prev) => {
      const nextChats = [newChat, ...prev];
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
