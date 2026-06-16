"use client";
import { APP_ROUTES } from "@/lib/routes";
import NavPill from "@/components/shared/header/nav-pill";
import { ChatIcon, DocumentIcon } from "@/components/icons";
import { usePathname } from "next/navigation";

export default function SubheaderNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-row gap-2 w-full px-4.5 py-6 bg-sidebar"
      aria-label="Navigation principale"
    >
      <NavPill
        path={APP_ROUTES.HOME}
        icon={<ChatIcon className="h-4 w-4" aria-hidden="true" />}
        label={"Chat"}
        isActive={pathname.startsWith(APP_ROUTES.HOME)}
      />
      <NavPill
        path={APP_ROUTES.PRESS_REVIEW}
        icon={<DocumentIcon className="h-4 w-4" aria-hidden="true" />}
        label={"Revue de presse"}
        isActive={pathname.startsWith(APP_ROUTES.PRESS_REVIEW)}
      />
    </nav>
  );
}
