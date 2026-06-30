import { BotIcon } from "@/components/icons";

export function TypingIndicator() {
  return (
    <div className="flex gap-x-2.5 flex-row-reverse justify-end">
      {/* bulle de message */}
      <div className="bg-secondary-light rounded-lg px-4 py-3 flex items-center gap-x-1.5 h-11">
        <span className="sr-only">L&apos;IA est en train d&apos;écrire...</span>
        <div className="w-2 h-2 bg-[#717182] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-[#717182] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-[#717182] rounded-full animate-bounce"></div>
      </div>

      {/* bloc avatar */}
      <div className="rounded-full size-8 flex justify-center items-center shrink-0 bg-secondary-light">
        <BotIcon className="size-4 text-base" aria-hidden="true" />
      </div>
    </div>
  );
}
