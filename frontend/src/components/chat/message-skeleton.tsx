import { cn } from "@/lib/utils";

export function MessageSkeleton({ isUser }: { isUser: boolean }) {
  return (
    <div
      className={cn(
        "flex gap-x-2.5 animate-pulse",
        isUser ? "flex-row justify-end" : "flex-row-reverse justify-end",
      )}
    >
      {/* bloc message */}
      <div
        className={cn(
          "flex flex-col gap-y-3 rounded-lg p-4 w-72 justify-between",
          isUser ? "bg-dark/10" : "bg-secondary-light/60",
        )}
      >
        <div className="h-3.5 bg-neutral-300 dark:bg-neutral-600 rounded w-11/12"></div>
        <div className="h-3.5 bg-neutral-300 dark:bg-neutral-600 rounded w-4/5"></div>
        <div className="h-2.5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 self-end mt-2"></div>
      </div>

      {/* bloc avatar */}
      <div
        className={cn(
          "rounded-full size-8 flex justify-center items-center shrink-0",
          isUser ? "bg-avatar/20" : "bg-secondary-light/60",
        )}
      >
        <div className="size-4 rounded-full bg-neutral-300 dark:bg-neutral-600" />
      </div>
    </div>
  );
}
