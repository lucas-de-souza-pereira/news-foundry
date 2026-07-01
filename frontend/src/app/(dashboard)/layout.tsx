"use client";

// React & Hooks
import { useEffect, useState } from "react";

// Next.js
import { usePathname, useRouter } from "next/navigation";

// Components
import ChatListItem from "@/components/shared/slidebar/chat-list-item";

// Actions
import { getAllChatAction } from "@/lib/actions/chat";

// Contexts
import { AuthProvider, useAuth } from "@/context/auth-context";

// Routes & Config
import { API_ROUTES, APP_ROUTES } from "@/lib/routes";

// Types
import { Chat } from "@/lib/validation/chat";
import { ChatProvider, useChats } from "@/context/chat-context";
import { Logo, LogOutIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { StorageUtility } from "@/lib/local-storage";
import Sidebar from "@/components/shared/slidebar/sidebar";
import SubhearderChat from "@/components/shared/header/subhearder-chat";
import SubheaderNav from "@/components/shared/header/subheader-nav";
import { Toaster } from "sonner";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }
  return <>{children}</>;
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatPage = pathname.startsWith("/chat");

  return (
    <div className="flex flex-row h-screen min-h-0 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full">
        <header>{isChatPage ? <SubhearderChat /> : <SubheaderNav />}</header>

        <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <ChatProvider>
          <AuthenticatedLayout>
            {children}
            <Toaster />
          </AuthenticatedLayout>
        </ChatProvider>
      </ProtectedRoute>
    </AuthProvider>
  );
}
