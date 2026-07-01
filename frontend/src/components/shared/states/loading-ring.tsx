// External Libraries
import { Loader2 } from "lucide-react";

export default function LoadingRing() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-y-4"
    >
      <Loader2 className="size-16 animate-spin text-primary" />
      <p className="text-subtle text-sm animate-pulse">
        Recherche et analyse des actualités en cours...
      </p>
    </div>
  );
}
