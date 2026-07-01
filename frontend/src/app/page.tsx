// Next.js
import { redirect } from "next/navigation";

// Routes & Config
import { APP_ROUTES } from "@/lib/routes";

export default function RootPage() {
  redirect(APP_ROUTES.HOME);
}
