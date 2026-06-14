"use client";

// React & Hooks
import { useEffect, useState } from "react";

// Next.js
import { useRouter } from "next/navigation";

// Components
import ChatSelected from "@/components/chat/chat-selected";

// Actions
import { getAllChatAction } from "@/lib/actions/chat";

// Contexts
import { AuthProvider, useAuth } from "@/context/auth-context";

// Routes & Config
import { APP_ROUTES } from "@/lib/routes";

// Types
import { Chat } from "@/lib/validation/chat";

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
  const { token } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!token) return;

    const loadChats = async () => {
      const res = await getAllChatAction(token);
      if (res.success) {
        setChats(res.data);
      } else {
        console.error(res.error);
      }
    };
    loadChats();
  }, [token]);

  return (
    <div className="flex flex-row">
      <aside>
        <nav>
          <ul>
            {chats.map((c) => (
              <li key={c.id}>
                <ChatSelected chat={c} />
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main>{children}</main>
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
        <AuthenticatedLayout>{children}</AuthenticatedLayout>
      </ProtectedRoute>
    </AuthProvider>
  );
}
