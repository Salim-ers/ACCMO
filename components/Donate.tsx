import type { CSSProperties } from "react";
import { LINKS } from "@/lib/site";
import Reveal from "@/components/Reveal";
import { Icon } from "@/components/Icons";

export default function Donate() {
  return (
    <section id="dons" className="container-x py-20 sm:py-28">
      <Reveal y={36} className="grid gap-6 lg:grid-cols-2">
        {/* École */}
        <div className="card-glow flex flex-col p-8 sm:p-10">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Icon.book width={22} height={22} />
          </span>
          <h2 className="mt-5 font-display text-2xl font-semibold text-emerald-900 sm:text-3xl">
            Notre école — Al Ghazali
          </h2>
          <p className="mt-4 leading-relaxed text-emerald-800/80">
            Le projet éducatif de la mosquée se prolonge à travers l&apos;école Al Ghazali :
            un cadre bienveillant et exigeant qui allie réussite scolaire et transmission des
            valeurs, pour accompagner nos enfants de la maternelle jusqu&apos;à leur épanouissement.
          </p>
          <a
            href={LINKS.ecole}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-auto w-fit pt-0.5"
          >
            Découvrir l&apos;école <Icon.arrow width={16} height={16} />
          </a>
        </div>

        {/* Don */}
        <div
          className="photo-bg relative flex flex-col items-start overflow-hidden rounded-3xl p-8 text-sand-50 sm:p-10"
          style={{ "--photo": "url('/photos/mosquee-mihrab.png')" } as CSSProperties}
        >
          <div className="pattern-svg pointer-events-none absolute inset-0 opacity-30" aria-hidden />
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-500/20 blur-3xl animate-float-slow" aria-hidden />
          <span className="eyebrow !text-gold-400">
            <span className="h-px w-6 bg-gold-500" aria-hidden /> Soutenir
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
            Votre don fait vivre la mosquée
          </h2>
          <p className="mt-4 text-sand-100/85">
            Charges de fonctionnement, entretien, activités éducatives et actions solidaires :
            chaque contribution compte. Qu&apos;Allah vous récompense.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={LINKS.don} target="_blank" rel="noopener noreferrer" className="btn-gold">
              <Icon.heart width={18} height={18} /> Faire un don
            </a>
            <a
              href={LINKS.cotisation}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost !text-sand-50 !ring-white/40 hover:!bg-white/15 hover:!text-sand-50"
            >
              Cotisation annuelle
            </a>
          </div>
          <p className="mt-6 text-xs text-sand-100/50">Paiement sécurisé via Stripe</p>
        </div>
      </Reveal>
    </section>
  );
}
