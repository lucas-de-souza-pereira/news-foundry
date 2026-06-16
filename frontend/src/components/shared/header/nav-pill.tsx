import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

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
      className={cn(
        "flex gap-2 items-center rounded-md px-4 py-2",
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-button-inactive-bg text-body hover:bg-primary hover:text-primary-foreground transition-colors duration-300",
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
