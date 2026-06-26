"use client";

// React
import { useState } from "react";

// Next
import { useParams, useRouter } from "next/navigation";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Contexts
import { useAuth } from "@/context/auth-context";

// Server Actions
import { generatePressReviewAction } from "@/lib/actions/press-review";

// Routes
import { APP_ROUTES } from "@/lib/routes";

// Utilities
import { cn } from "@/lib/utils";

// Types
import { PressReviewRequest } from "@/lib/validation/press-review";

interface PressReviewFormProps {
  onSuccess?: () => void;
}

export default function PressReviewForm({ onSuccess }: PressReviewFormProps) {
  const router = useRouter();
  const params = useParams<{ chat: string; id: string }>();
  const chat_id = parseInt(params.id);
  const { token } = useAuth();

  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    if (!subject.trim()) {
      setError("Veuillez choisir un thème");
      return;
    }

    const request: PressReviewRequest = {
      chat_id,
      subject,
    };

    setIsSubmitting(true);
    setError(null);

    const res = await generatePressReviewAction(request, token);
    if (res.success) {
      if (onSuccess) {
        onSuccess();
      }
      router.push(APP_ROUTES.PRESS_REVIEW);
    } else {
      setError(res.error);
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-start w-full px-11 gap-y-4"
    >
      <label htmlFor="theme-input" className="text-base leading-none">
        Thème de la revue de presse
      </label>
      <Input
        id="theme-input"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <div aria-live="polite" className="w-full">
        {error && (
          <p className="text-red-500 text-sm mt-2" role="alert">
            {error}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className={cn("w-full leading-none", error ? "mb-0" : "mb-3")}
      >
        {isSubmitting ? "Envoi en cours..." : "Générer"}
      </Button>
    </form>
  );
}
