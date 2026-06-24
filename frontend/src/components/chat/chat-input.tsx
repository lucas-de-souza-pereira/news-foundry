"use client";

// React & Hooks
import { useEffect, useRef, useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "../icons";

interface ChatInputProps {
  sendMessage: (message: string) => void;
  isSubmitting: boolean;
  isNewChat?: boolean;
  disabled?: boolean;
}

export default function ChatInput({
  sendMessage,
  isSubmitting,
  isNewChat,
  disabled = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  });

  const handleSubmit = (e?: React.SubmitEvent) => {
    if (e) e.preventDefault();
    if (input.trim() && !isSubmitting) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (input.trim() && !isSubmitting) {
        handleSubmit();
      }
    }
  };

  return (
    <form
      className="flex flex-row max-w-[1000px] space-x-2 w-full mx-auto"
      onSubmit={handleSubmit}
      aria-label="Zone de saisie du message"
    >
      <Textarea
        ref={textareaRef}
        name="message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Tapez votre message ici..."
        className=""
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        maxLength={500}
        aria-label="Saisir votre message"
        disabled={disabled}
      />
      <Button
        className="text-primary-foreground bg-primary rounded-md w-12 h-10
        disabled:text-button-inactive-bg disabled:bg-button-disabled-icon  hover:bg-dark focus:bg-dark"
        disabled={disabled || isSubmitting || (!isFocused && !input)}
      >
        <SendIcon className="w-4 h-4" />
        <span className="sr-only">
          Envoyer le message {isNewChat ? "pour démarer une conversation" : ""}
        </span>
      </Button>
    </form>
  );
}
