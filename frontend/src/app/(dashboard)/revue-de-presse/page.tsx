"use client";

import ChatInput from "@/components/chat/chat-input";
import PressReviewCard from "@/components/press-review/press-review-card";

const mookPressReview = [
  {
    title:
      "Revue de presse : Football \u2013 Coupe du Monde 2026 et actualit\u00e9s du 24 juin 2026",
    subject: "Football",
    general_summary:
      "Cette revue de presse synth\u00e9tise les principales actualit\u00e9s footballistiques du 24 juin 2026, avec un focus sur la Coupe du Monde 2026 en cours, les r\u00e9sultats des matchs, les qualifications, ainsi que les derni\u00e8res nouvelles concernant les \u00e9quipes nationales et les joueurs cl\u00e9s comme Neymar et l'\u00e9quipe de France. Elle inclut \u00e9galement les enjeux sportifs et les d\u00e9fis des grandes nations footballistiques.",
    articles: [
      {
        title:
          "Coupe du Monde 2026 : R\u00e9sultats et qualifications du 24 juin",
        summary:
          "La Colombie s'est qualifi\u00e9e pour les 16es de finale apr\u00e8s une victoire d\u00e9cisive. La Croatie, malgr\u00e9 un d\u00e9but difficile, a r\u00e9ussi \u00e0 se relancer avec un match nul contre le Br\u00e9sil. L'Angleterre a \u00e9t\u00e9 accroch\u00e9e par le Ghana, tandis que le S\u00e9n\u00e9gal a vu son gardien \u00c9douard Mendy forfait pour le match contre l'Irak en raison d'une blessure.",
      },
      {
        title: "Programme du jour : Suisse-Canada et Bosnie-Qatar en lice",
        summary:
          "Ce 24 juin 2026, deux matchs sont au programme de la Coupe du Monde : la rencontre entre la Suisse et le Canada \u00e0 21h (heure de Vancouver), ainsi que le match opposant la Bosnie au Qatar \u00e0 21h (heure de Seattle). Ces rencontres pourraient influencer le classement des groupes concern\u00e9s.",
      },
      {
        title:
          "\u00c9quipe de France : Deschamps absent, St\u00e9phan aux commandes",
        summary:
          "Didier Deschamps, s\u00e9lectionneur des Bleus, est absent pour des raisons familiales. C'est donc Guy St\u00e9phan qui assure l'int\u00e9rim sur le banc de l'\u00e9quipe de France. Le prochain match des Bleus aura lieu jeudi 25 juin \u00e0 Miami contre le Br\u00e9sil, avec le retour attendu de Neymar dans les rangs br\u00e9siliens.",
      },
      {
        title:
          "Br\u00e9sil : Sous pression apr\u00e8s un d\u00e9but de tournoi d\u00e9cevant",
        summary:
          "Le Br\u00e9sil, pays h\u00f4te et favori du tournoi, traverse une phase difficile avec deux matchs nuls en deux rencontres. La pression s'accentue sur les joueurs, notamment apr\u00e8s l'annonce du retour de Neymar pour le match contre l'\u00c9cosse.",
      },
      {
        title: "Argentine : En difficult\u00e9 apr\u00e8s deux matchs nuls",
        summary:
          "L'Argentine, championne du monde en titre, traverse une phase compliqu\u00e9e apr\u00e8s deux matchs nuls cons\u00e9cutifs. Les attentes sont immenses, mais les r\u00e9sultats ne suivent pas encore, ce qui suscite des interrogations sur la capacit\u00e9 de l'\u00e9quipe \u00e0 se relancer.",
      },
      {
        title: "Neymar de retour pour le Br\u00e9sil contre l'\u00c9cosse",
        summary:
          "Neymar, star br\u00e9silienne, fera son retour sur les terrains pour le match contre l'\u00c9cosse jeudi 25 juin \u00e0 Miami. Son retour est tr\u00e8s attendu, car il pourrait apporter une dynamique nouvelle \u00e0 l'\u00e9quipe br\u00e9silienne en difficult\u00e9.",
      },
    ],
    created_at: "2026-06-24T15:28:47.834720Z",
  },
];

export default function PressReviewPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-background flex flex-col gap-y-2.5 px-22.5 pt-10 overflow-y-auto">
        <div>
          <h1 className="text-title font-medium text-2xl tracking-[0.07px] leading-9">
            Revues de Presse
          </h1>
          <p className="text-base text-subtle tracking-[-0.31px] leading-6">
            Consultez et gérez vos revues de presse générées par l'IA
          </p>
        </div>

        {mookPressReview.map((review) => (
          <PressReviewCard
            key={`${review.title}-${review.created_at}`}
            review={review}
          />
        ))}
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
