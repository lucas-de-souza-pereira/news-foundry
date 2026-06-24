"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { generatePressReviewAction } from "@/lib/actions/press-review";
import { cn } from "@/lib/utils";
import { PressReviewRequest } from "@/lib/validation/press-review";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function PressReviewForm() {
  const params = useParams<{ chat: string; id: string }>();
  const chat_id = parseInt(params.id);
  const { token } = useAuth();

  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSumbit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    const request: PressReviewRequest = {
      chat_id,
      subject,
    };

    setIsSubmitting(true);
    setSuccess(null);

    if (!request) {
      setError("Veuillez choisir un thème");
      setIsSubmitting(false);
    }

    const res = await generatePressReviewAction(request, token);
    if (res.success) {
      setSuccess("Génération de la revue réussi");
      setError(null);

      //   router.push(APP_ROUTES.HOME);
    }

    if (!res.success) {
      setError(res.error);
      setSuccess(null);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSumbit}>
      <label htmlFor="subject">Thème de la revue de presse</label>
      <Input
        id="subject"
        aria-label="Thème"
        onChange={(e) => setSubject(e.target.value)}
      />

      <Button
        type="submit"
        aria-label="Généner la revue"
        disabled={isSubmitting}
        className={cn("mt-6", error || success ? "mb-3" : "mb-6")}
      >
        {isSubmitting ? "Envoi en cours..." : "Générer"}
      </Button>
    </form>
  );
}
