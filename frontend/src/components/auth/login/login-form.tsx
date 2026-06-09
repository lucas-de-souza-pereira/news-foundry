"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/actions/auth";
import { LoginCredentials } from "@/lib/validation/auth";
import { APP_ROUTES } from "@/lib/routes";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      return;
    }

    const res = await loginAction(credentials);
    if (res.success) {
      setSuccess("Connexion réussie");
      setError(null);
      // router.push(APP_ROUTES.HOME);
    }

    if (!res.success) {
      setError(res.error);
      setSuccess(null);
    }

    setIsSubmitting(false);
  };

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-xs"
      onSubmit={handleSubmit}
    >
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}
      <Input
        type="email"
        placeholder="votre.email@exemple.com"
        aria-label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Mot de passe"
        aria-label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" aria-label="Se connecter" disabled={isSubmitting}>
        {isSubmitting ? "Connexion en cours..." : "Se connecter"}
      </Button>
    </form>
  );
}
