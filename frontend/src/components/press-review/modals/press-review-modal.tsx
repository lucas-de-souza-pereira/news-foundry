"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import PressReviewForm from "./press-review-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PressReviewModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsModalOpen(true)}>
          Générer une revue de presse
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Générer une revue de presse</DialogTitle>
          <DialogDescription>
            Donner un titre à votre revue de presse{" "}
          </DialogDescription>
        </DialogHeader>

        <PressReviewForm />
      </DialogContent>
    </Dialog>
  );
}
