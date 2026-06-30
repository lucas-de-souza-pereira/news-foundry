"use client";

import {
  formatHourMinutes,
  formatLongFrenchDate,
  formatWeekNumber,
} from "@/lib/utils";
import { PressReview } from "@/lib/validation/press-review";
import { CalendarIcon } from "../icons";
import { Button } from "../ui/button";
import { toast, Toaster } from "sonner";

interface PressReviewCardProps {
  review: PressReview;
}

export default function PressReviewCard({ review }: PressReviewCardProps) {
  const handleCopy = async () => {
    const copyText = `${review.title}\n\n${review.general_summary}\n\n${review.articles
      .map((art) => `${art.title} : ${art.summary}`)
      .join("\n\n")}`;
    await navigator.clipboard.writeText(copyText);
    toast.success("Revue de presse copiée", {
      position: "top-center",
      duration: 2000,
    });
  };

  return (
    <article className=" p-10 rounded-xl bg-card border-t border-black/10">
      <header className="flex justify-between items-center">
        <div className="flex flex-col gap-y-2">
          <h2 className="uppercase text-base tracking-[-0.31px] font-heading text-title leading-none">
            Actualités {review.subject} - semaine{" "}
            {formatWeekNumber(review.created_at)}{" "}
          </h2>
          <time
            dateTime={review.created_at}
            className="flex items-center gap-2 text-subtle text-sm leading-none"
          >
            <CalendarIcon className="size-4" />
            {formatLongFrenchDate(review.created_at) +
              " à " +
              formatHourMinutes(review.created_at)}
          </time>
        </div>
        <Button onClick={handleCopy} className="px-3 py-6 rounded-sm">
          Copier
        </Button>
      </header>
      <div className="mt-4 flex flex-col gap-2.5 text-sm text-body leading-none">
        <h3>{review.title}</h3>
        <p className="font-semibold">{review.general_summary}</p>

        <ul className="list-disc pl-5 space-y-2.5">
          {review.articles.map((art, index) => (
            <li key={index}>
              <h3 className="inline font-semibold">{art.title}</h3> :{" "}
              {art.summary}
            </li>
          ))}
        </ul>
      </div>
      <Toaster />
    </article>
  );
}
