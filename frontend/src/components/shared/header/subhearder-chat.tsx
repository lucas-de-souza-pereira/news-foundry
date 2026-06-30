"use client";
// next
import Link from "next/link";

// Routes
import { APP_ROUTES } from "@/lib/routes";
import { ArrowLeft } from "@/components/icons";
import PressReviewModal from "@/components/press-review/modals/press-review-modal";

export default function SubhearderChat() {
  return (
    <div
      className="h-22 flex flex-row justify-between items-center gap-2 w-full pl-3.5 pr-4.5 bg-sidebar border-b border-border "
      aria-label="En-tête de la discussion"
    >
      <Link
        href={APP_ROUTES.HOME}
        aria-label="Retourner à l'accueil"
        className="flex flex-row items-center gap-x-2 p-1"
      >
        <ArrowLeft className="w-4.5" aria-hidden="true" />

        <div className="flex flex-col gap-y-1 ">
          <h2 className="font-heading text-[#000000] text-lg tracking-[-0.31px]">
            Nouvelle Discussion
          </h2>
          <p className="text-sm text-muted-foreground">Conversation active</p>
        </div>
      </Link>
      <PressReviewModal />
    </div>
  );
}
