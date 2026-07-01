"use client";

// React & Hooks
import { useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

// Components
import PressReviewForm from "./press-review-form";

// Icons
import { DocumentIcon } from "@/components/icons";

export default function PressReviewModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary rounded-md px-6 py-5.25 flex gap-x-2.5 h-15 hover:bg-dark disabled:bg-muted disabled:text-muted-foreground focus:bg-dark"
          disabled={isModalOpen}
        >
          <DocumentIcon className="size-4" aria-hidden="true" />
          Générer une revue de presse
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="bg-card px-8.5 py-8 border border-border ring-0 flex flex-col gap-y-10 items-center md:max-w-[556px] w-full "
      >
        <div className="w-full flex justify-end">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="text-subtle text-xs leading-none"
              size="sm"
            >
              Fermer
            </Button>
          </DialogClose>
        </div>

        <DialogHeader className="gap-2.25 text-center leading-none">
          <DialogTitle className="font-bold text-lg tracking-[-0.31px] text-body">
            Générer une revue de presse
          </DialogTitle>
          <DialogDescription className="text-subtle text-sm  ">
            Donner un titre à votre revue de presse{" "}
          </DialogDescription>
        </DialogHeader>

        <PressReviewForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
