"use client";

import ChatInput from "@/components/chat/chat-input";
import SubheaderNav from "@/components/shared/header/subheader-nav";

export default function PressReviewPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-background flex  ">
        <div>
          <h1>Revues de Presse</h1>
          <p>Consultez et gérez vos revues de presse générées par l'IA</p>
        </div>
      </div>

      <div className="bg-card px-18 py-4.25 w-full flex flex-col gap-y-3">
        <ChatInput
          sendMessage={() => {}}
          isSubmitting={false}
          disabled={true}
        />
      </div>
    </div>
  );
}
