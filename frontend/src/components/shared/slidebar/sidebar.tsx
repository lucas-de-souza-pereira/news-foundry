"use client";

// Next.js
import { useRouter, useParams, useSearchParams } from "next/navigation";

// Components
import ChatListItem from "@/components/shared/slidebar/chat-list-item";
import { Button } from "@/components/ui/button";

// Contexts
import { useChats } from "@/context/chat-context";

// Routes & Config
import { APP_ROUTES } from "@/lib/routes";

// Types
import { Logo, LogOutIcon } from "@/components/icons";

// Utils
import { StorageUtility } from "@/lib/local-storage";
import { useEffect } from "react";

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
      className="flex flex-col bg-sidebar min-h-screen"
      aria-label="Barre latérale"
    >
      <div className="pl-6 pr-37.5 py-9 text-primary border-b border-r border-border">
        <Logo className="w-37 h-3.75" aria-hidden="true" />
      </div>
      <nav
        className="flex-1 flex flex-col justify-between "
        aria-label="Historique des conversations"
      >
        <ul className="overflow-y-auto" aria-label="Liste des conversations">
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
