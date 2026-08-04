import Link from "next/link";
import type { Metadata } from "next";
import { NAV, ROUTES } from "@/lib/site";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main
      id="contenu"
      className="flex min-h-screen flex-col justify-center bg-[var(--color-surface)] py-16"
    >
      <div className="shell max-w-3xl">
        <p className="tabular text-[13px] font-bold uppercase tracking-[0.18em] text-terra-600">
          Erreur 404
        </p>
        <h1 className="title-xl mt-5 text-night-900">
          Cette page
          <br />
          n’existe pas.
        </h1>
        <p className="mt-5 max-w-lg text-[16.5px] leading-relaxed text-night-600">
          Le lien est peut-être ancien, ou la page a changé d’adresse. Voici les
          destinations principales du site.
        </p>

        <nav aria-label="Destinations principales" className="mt-9">
          <ul className="border-t border-[var(--rule-strong)]">
            {[...NAV, { label: "Soutenir la mosquée", href: ROUTES.don, desc: "Don ponctuel ou cotisation annuelle" }].map(
              (item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between gap-5 border-b border-[var(--rule)] py-4"
                  >
                    <span>
                      <span className="block text-[19px] font-extrabold tracking-tight text-night-900">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-[13.5px] text-night-600">
                        {item.desc}
                      </span>
                    </span>
                    <Icon.arrow
                      width={18}
                      height={18}
                      className="shrink-0 text-night-500 transition-transform group-hover:translate-x-1 group-hover:text-terra-600"
                    />
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        <Link href={ROUTES.home} className="btn btn-primary mt-9">
          Retour à l’accueil
          <Icon.arrow width={16} height={16} className="arw" />
        </Link>
      </div>
    </main>
  );
}
