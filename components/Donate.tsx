import { LINKS } from "@/lib/site";
import Reveal from "@/components/Reveal";
import { Icon } from "@/components/Icons";

export default function Donate() {
  return (
    <section id="dons" className="container-x py-20 sm:py-28">
      <Reveal y={36}>
        <div className="pattern-geo relative overflow-hidden rounded-3xl px-6 py-14 text-center text-sand-50 sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-500/20 blur-3xl" aria-hidden />
          <span className="eyebrow !text-gold-400">
            <span className="h-px w-6 bg-gold-500" aria-hidden /> Soutenir
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl sm:text-4xl font-semibold">
            Votre don fait vivre la mosquée
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sand-100/80">
            Charges de fonctionnement, entretien, activités éducatives et actions
            solidaires : chaque contribution compte. Qu&apos;Allah vous récompense.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href={LINKS.don} target="_blank" rel="noopener noreferrer" className="btn-gold">
              <Icon.heart width={18} height={18} /> Faire un don
            </a>
            <a
              href={LINKS.cotisation}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost !text-sand-50 !ring-white/30"
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
