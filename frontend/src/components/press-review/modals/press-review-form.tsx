"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { generatePressReviewAction } from "@/lib/actions/press-review";
import { cn } from "@/lib/utils";
import { PressReviewRequest } from "@/lib/validation/press-review";
import { useParams } from "next/navigation";
import { useState } from "react";

interface PressReviewFormProps {
  onSuccess?: () => void;
}

export default function PressReviewForm({ onSuccess }: PressReviewFormProps) {
  const params = useParams<{ chat: string; id: string }>();
  const chat_id = parseInt(params.id);
  const { token } = useAuth();

  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    setSuccess(null);
    setError(null);

    const res = await generatePressReviewAction(request, token);
    if (res.success) {
      setSuccess("Génération de la revue réussie");
      setError(null);

      if (onSuccess) {
        onSuccess();
      }
    } else {
      setError(res.error);
      setSuccess(null);
    }

    setIsSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-start w-full px-11 gap-y-4"
    >
      <label htmlFor="subject" className="text-base leading-none">
        Thème de la revue de presse
      </label>
      <Input
        id="subject"
        aria-label="Thème"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

      <Button
        type="submit"
        aria-label="Générer la revue"
        disabled={isSubmitting}
        className={cn(
          "w-full leading-none",
          error || success ? "mb-0" : "mb-3",
        )}
      >
        {isSubmitting ? "Envoi en cours..." : "Générer"}
      </Button>
    </form>
  );
}
