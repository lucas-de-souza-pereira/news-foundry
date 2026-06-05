import LoginForm from "@/components/auth/login/login-form";

export default function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoginForm aria-label="Formulaire de connexion" />
    </div>
  );
}
