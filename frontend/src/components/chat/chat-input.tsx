"use client";

// React & Hooks
import { useEffect, useRef, useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Icons
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  });

  const handleSubmit = (e?: React.SubmitEvent) => {
    if (e) e.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput) {
      setError(
        "Le message ne peut pas être vide ou contenir uniquement des espaces.",
      );
      return;
    }

    const isOnlyNumbers = /^\d+$/.test(trimmedInput);
    if (isOnlyNumbers) {
      setError(
        "Le format des données est incorrect. Le message ne peut pas contenir uniquement des chiffres.",
      );
      return;
    }

    if (!isSubmitting) {
      sendMessage(trimmedInput);
      setInput("");
      setError(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      className="flex flex-col max-w-[1000px] w-full mx-auto gap-y-2"
      onSubmit={handleSubmit}
      aria-label="Zone de saisie du message"
    >
      {error && (
        <p
          className="text-destructive text-center text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-200"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      <div className="flex flex-row space-x-2 w-full">
        <Textarea
          ref={textareaRef}
          name="message"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError(null);
          }}
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
          <SendIcon className="w-4 h-4" aria-hidden="true" />
          <span className="sr-only">
            Envoyer le message{" "}
            {isNewChat ? "pour démarer une conversation" : ""}
          </span>
        </Button>
      </div>
    </form>
  );
}
