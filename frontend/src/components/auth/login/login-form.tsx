"use client";
// React & Hooks
import { useEffect, useState } from "react";

// Next.js
import { useRouter, useSearchParams } from "next/navigation";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Actions
import { loginAction } from "@/lib/actions/auth";

// Routes & Config
import { APP_ROUTES } from "@/lib/routes";

// Utilities & Libs
import { cn } from "@/lib/utils";

// Types & Validation
import { LoginCredentials } from "@/lib/validation/auth";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isExpired = searchParams.get("expired");

  useEffect(() => {
    if (isExpired === "1") {
      Promise.resolve().then(() => {
        setError("Votre session a expiré. Veuillez vous reconnecter.");
      });
    }
  }, [isExpired]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const credentials: LoginCredentials = {
      email,
      password,
    };

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!credentials.email || !credentials.password) {
      setError("L'email et mot de passe sont requis");
      setIsSubmitting(false);
      return;
    }

    const res = await loginAction(credentials);
    if (res.success) {
      setSuccess("Connexion réussie");
      setError(null);

      router.push(APP_ROUTES.HOME);
    }

    if (!res.success) {
      setError(res.error);
      setSuccess(null);
    }
    setIsSubmitting(false);
  };

  return (
    <form className="flex flex-col w-full" onSubmit={handleSubmit}>
      <div className=" flex flex-col gap-y-3">
        <label htmlFor="email">Adresse email</label>
        <Input
          type="email"
          placeholder="votre.email@exemple.com"
          aria-label="Adresse email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-y-3 mt-4">
        <label htmlFor="password">Mot de passe</label>
        <Input
          type="password"
          placeholder="Mot de passe"
          aria-label="Mot de passe"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        aria-label="Se connecter"
        disabled={isSubmitting}
        className={cn("mt-6", error || success ? "mb-3" : "mb-6")}
      >
        {isSubmitting ? "Connexion en cours..." : "Se connecter"}
      </Button>

      {error && (
        <p className="text-destructive text-center text-sm" aria-live="polite">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-500 text-center" aria-live="polite">
          {success}
        </p>
      )}
    </form>
  );
}
