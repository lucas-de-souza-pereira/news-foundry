import { APP_ROUTES } from "@/lib/routes";
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect(APP_ROUTES.HOME);
}
