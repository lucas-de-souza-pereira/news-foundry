"use client";

import Link from "next/link";
import { ArrowLeft } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background  min-h-screen">
      <div className="max-w-md w-full text-center space-y-8 bg-card border border-border rounded-xl p-10">
        <div className="space-y-3">
          <h1 className="text-8xl font-extrabold text-primary font-heading">
            404
          </h1>
          <h2 className="text-2xl font-bold text-subtle">Page introuvable</h2>
          <p className="text-subtle-light text-sm max-w-sm mx-auto leading-relaxed">
            Oups ! La page que vous recherchez semble s&apos;être perdue dans
            nos archives ou n&apos;existe plus.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-md"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retourner à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
