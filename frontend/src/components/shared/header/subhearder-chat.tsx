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
      className="flex flex-row justify-between items-center gap-2 w-full px-4.5 py-4.5 bg-sidebar"
      aria-label="En-tête de la discussion"
    >
      <div className="flex flex-row items-center gap-x-2">
        <Link href={APP_ROUTES.HOME} aria-label="Retourner à l'accueil">
          <ArrowLeft className="w-4.5" aria-hidden="true" />
        </Link>
        <div className="flex flex-col gap-y-1 ">
          <h2 className="font-heading text-[#000000] text-lg tracking-[-0.31px]">
            Nouvelle Discussion
          </h2>
          <p className="text-sm text-muted-foreground">Conversation active</p>
        </div>
      </div>
      <PressReviewModal />
    </div>
  );
}
