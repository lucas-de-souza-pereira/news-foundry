"use client";

// React & Hooks
import { useEffect } from "react";

// Next.js
import { usePathname, useRouter } from "next/navigation";

// External Libraries
import { Toaster } from "sonner";

// Components
import Sidebar from "@/components/shared/slidebar/sidebar";
import SubhearderChat from "@/components/shared/header/subhearder-chat";
import SubheaderNav from "@/components/shared/header/subheader-nav";

// Contexts
import { AuthProvider, useAuth } from "@/context/auth-context";
import { ChatProvider } from "@/context/chat-context";

// Routes & Config
import { APP_ROUTES } from "@/lib/routes";

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
