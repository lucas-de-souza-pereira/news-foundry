"use client";

// React & Hooks
import { useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  sendMessage: (message: string) => void;
}

export default function ChatInput({ sendMessage }: ChatInputProps) {
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-row">
      <form
        className="flex w-full max-w-2xl space-x-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
          setInput("");
        }}
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tapez votre message ici..."
        />
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          Envoyer
        </Button>
      </form>
    </div>
  );
}
