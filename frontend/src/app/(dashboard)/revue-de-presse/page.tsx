"use client";

import ChatInput from "@/components/chat/chat-input";
import PressReviewCard from "@/components/press-review/press-review-card";
import { useAuth } from "@/context/auth-context";
import { getAllPressReviewAction } from "@/lib/actions/press-review";
import { PressReview } from "@/lib/validation/press-review";
import { useEffect, useState } from "react";

export default function PressReviewPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pressReviews, setPressReviews] = useState<PressReview[]>([]);

  useEffect(() => {
    const fetchPressReviews = async () => {
      if (!token) return;
      setLoading(true);
      const res = await getAllPressReviewAction(token);
      if (res.success) {
        setPressReviews(res.data);
      }
      setLoading(false);
    };

    fetchPressReviews();
  }, [token]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 bg-background flex flex-col gap-y-2.5 px-22.5 pt-10 overflow-y-auto  pb-2.5">
        <div>
          <h1 className="text-title font-medium text-2xl tracking-[0.07px] leading-9">
            Revues de Presse
          </h1>
          <p className="text-base text-subtle tracking-[-0.31px] leading-6">
            Consultez et gérez vos revues de presse générées par l'IA
          </p>
        </div>
        {pressReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-base text-subtle tracking-[-0.31px] leading-6">
              Aucune revue de presse trouvée
            </p>
          </div>
        ) : (
          pressReviews.map((review) => (
            <PressReviewCard
              key={`${review.title}-${review.created_at}`}
              review={review}
            />
          ))
        )}
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
