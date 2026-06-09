"use client";

import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
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

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedRoute>{children}</ProtectedRoute>
    </AuthProvider>
  );
}
