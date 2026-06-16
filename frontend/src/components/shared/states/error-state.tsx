"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error?: Error & { digest?: string };
  reset?: () => void;
  message?: string;
  children?: React.ReactNode;
}

export function ErrorState({
  error,
  reset,
  message,
  children,
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[400px] w-full p-6 text-center animate-in fade-in zoom-in-95 duration-500"
      role="alert"
    >
      <div className="bg-destructive/10 p-4 rounded-full mb-6">
        <AlertCircle className="w-12 h-12 text-destructive" />
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-2">
        Oups, quelque chose s&apos;est mal passé
      </h1>

      <p className="text-subtle max-w-md mb-8">
        {message ||
          "Une erreur inattendue est survenue. Nos équipes techniques ont été prévenues."}
        {error?.digest && (
          <span className="block mt-2 text-xs opacity-50 font-mono">
            ID d&apos;erreur : {error.digest}
          </span>
        )}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {reset && (
          <Button
            onClick={reset}
            className="bg-primary-button hover:bg-primary-button/90 text-primary-foreground px-8 py-6 h-auto text-base rounded-xl flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Réessayer
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}
