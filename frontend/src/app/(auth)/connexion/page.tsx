// Components
import LoginForm from "@/components/auth/login/login-form";

// Icons
import { Logo } from "@/components/icons";

export default function Login() {
  return (
    <div className="flex h-screen bg-grid-pattern w-screen items-center justify-center">
      <div className="bg-card py-12.5 px-8 rounded-xl w-[448px]">
        <div className="flex flex-col items-center gap-6">
          <h1 className="sr-only">Se connecter à News Foundry</h1>
          <Logo className="w-49 h-4.25 text-primary" aria-hidden="true" />
          <p className="px-8 text-subtle text-center">
            {"Connectez-vous pour accéder à votre assistant d'actualités IA"}
          </p>
        </div>

        <div className="flex justify-center mt-6">
          <LoginForm aria-label="Formulaire de connexion" />
        </div>
      </div>
    </div>
  );
}
