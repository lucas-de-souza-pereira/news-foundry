"use client";

// React & Hooks
import { useCallback, useEffect, useState } from "react";

// External Libraries
import { Loader2 } from "lucide-react";

// Components
import ChatInput from "@/components/chat/chat-input";
import PressReviewCard from "@/components/press-review/press-review-card";
import { ErrorState } from "@/components/shared/states/error-state";

// Contexts
import { useAuth } from "@/context/auth-context";

// Actions
import { getAllPressReviewAction } from "@/lib/actions/press-review";

// Types & Validation
import { PressReview } from "@/lib/validation/press-review";

export default function PressReviewPage() {
  const { token } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pressReviews, setPressReviews] = useState<PressReview[]>([]);

  const fetchPressReviews = useCallback(async () => {
    if (!token) return;

    const res = await getAllPressReviewAction(token);
    if (res.success) {
      setPressReviews(res.data);
      setError(null);
    } else {
      setError(res.error);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchPressReviews();
    });
  }, [fetchPressReviews]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchPressReviews();
  };

  const renderListContent = () => {
    if (isLoading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-2" />
          <p className="text-subtle text-sm">
            Chargement de vos revues de presse...
          </p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex-1 flex flex-col gap-3 items-center justify-center min-h-[300px]">
          <ErrorState message={error} reset={handleRetry} />
        </div>
      );
    }
    if (pressReviews.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
          <p className="text-base text-subtle tracking-[-0.31px] leading-6">
            Aucune revue de presse trouvée
          </p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-y-2.5">
        {pressReviews.map((review) => (
          <PressReviewCard
            key={`${review.title}-${review.created_at}`}
            review={review}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 bg-background flex flex-col gap-y-2.5 px-22.5 pt-10 overflow-y-auto  pb-2.5">
        <div>
          <h1 className="text-title font-medium text-2xl tracking-[0.07px] leading-9">
            Revues de Presse
          </h1>
          <p className="text-base text-subtle tracking-[-0.31px] leading-6">
            {"Consultez et gérez vos revues de presse générées par l'IA"}
          </p>
        </div>
        {renderListContent()}
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
