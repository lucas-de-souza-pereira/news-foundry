// React & Hooks
import { ReactNode } from "react";

// Next.js
import Link from "next/link";

// Utilities & Libs
import { cn } from "@/lib/utils";

interface NavPillProps {
  path: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
}

export default function NavPill({ path, icon, label, isActive }: NavPillProps) {
  return (
    <Link
      href={path}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex gap-2 items-center rounded-md px-4 py-2 text-sm antialiased font-normal",
        isActive
          ? "bg-primary text-primary-foreground font-bold "
          : "bg-button-inactive-bg text-body hover:bg-primary hover:text-primary-foreground transition-colors duration-300  hover:font-bold ",
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span className="">{label}</span>
    </Link>
  );
}
