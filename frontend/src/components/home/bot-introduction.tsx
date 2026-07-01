// Icons
import { BotIcon } from "../icons";

export default function BotIntroduction() {
  return (
    <div className="flex flex-col bg-card px-10 py-14 rounded-xl border border-border text-center max-w-[544px]">
      <BotIcon
        className="w-20.5 h-16.75 mx-auto text-primary hover:-rotate-5 transition-transform duration-500"
        aria-hidden="true"
      />
      <h2 className="font-heading text-[32px] tracking-[-0.31px] text-primary mt-6">
        Assistant Revue de Presse IA
      </h2>

      <p className="text-subtle-light px-3 mt-10">
        Posez-moi des questions sur l&apos;actualité récente ou demandez-moi de
        générer une revue de presse sur un sujet spécifique.
      </p>

      <div className="text-subtle text-sm mt-10">
        <h3 className="font-bold " id="examples-heading">
          Exemples :
        </h3>
        <ul
          className=" list-disc list-inside  flex flex-col gap-y-2.25 mt-2.25"
          aria-labelledby="examples-heading"
        >
          <li>
            &quot;Quelles sont les dernières nouvelles en politique ?&quot;
          </li>
          <li>&quot;Génère une revue de presse sur la technologie&quot;</li>
          <li>&quot;Résume l&apos;actualité économique de la semaine&quot;</li>
        </ul>
      </div>
    </div>
  );
}
