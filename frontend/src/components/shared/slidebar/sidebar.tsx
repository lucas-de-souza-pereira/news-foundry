"use client";

// React & Hooks
import { useEffect } from "react";

// Next.js
import { useRouter, useParams } from "next/navigation";

// UI Components
import { Button } from "@/components/ui/button";

// Components
import ChatListItem from "@/components/shared/slidebar/chat-list-item";

// Icons
import { Logo, LogOutIcon } from "@/components/icons";

// Contexts
import { useChats } from "@/context/chat-context";

// Routes & Config
import { APP_ROUTES } from "@/lib/routes";

// Utilities & Libs
import { StorageUtility } from "@/lib/local-storage";

export default function Sidebar() {
  const router = useRouter();
  const params = useParams();
  const { chats } = useChats();

  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const activeChatId = idParam ? Number(idParam) : null;

  const handleLogout = () => {
    StorageUtility.removeItem("SESSION_TOKEN");
    router.push(APP_ROUTES.LOGIN);
  };

  return (
    <aside
      className="flex flex-col bg-sidebar h-screen"
      aria-label="Barre latérale"
    >
      <div className="h-22 pl-6 pr-37.5 py-9 text-primary border-b border-r border-border">
        <Logo className="w-37 h-3.75" aria-hidden="true" />
      </div>
      <nav
        className="flex-1 flex flex-col min-h-0"
        aria-label="Historique des conversations"
      >
        <ul
          className="flex-1 overflow-y-auto scrollbar-thin-hover"
          aria-label="Liste des conversations"
        >
          {chats.map((c) => (
            <li key={c.id}>
              <ChatListItem chat={c} isActive={c.id === activeChatId} />
            </li>
          ))}
        </ul>
        <div className="w-full  ">
          <Button
            variant="ghost"
            className="w-full py-10 px-9 h-30 flex items-center justify-start hover:bg-sidebar-accent rounded-none duration-300"
            onClick={handleLogout}
            aria-label="Se déconnecter"
          >
            <LogOutIcon className="mr-2" />
            Se déconnecter
          </Button>
        </div>
      </nav>
    </aside>
  );
}
