"use client";

// React & Hooks
import { useEffect } from "react";

// Components
import { ErrorState } from "@/components/shared/states/error-state";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[70vh]">
      <ErrorState error={error} reset={reset} />
    </div>
  );
}
