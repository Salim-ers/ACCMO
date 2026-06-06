import Image from "next/image";
import { SITE, LINKS, NAV } from "@/lib/site";
import { Icon } from "@/components/Icons";

export default function Footer() {
  return (
    <footer className="pattern-geo text-sand-100">
      <div className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Identité */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="https://accmo.org/wp-content/uploads/2023/04/cropped-cropped-logo-creil-150x150-1.webp"
              alt="Logo de la Grande Mosquée de Creil"
              width={48}
              height={48}
              className="rounded-full ring-1 ring-white/15"
            />
            <div>
              <p className="font-display text-lg font-semibold text-sand-50">Mosquée de Creil</p>
              <p className="text-xs uppercase tracking-widest text-gold-400">Essalam · ACCMO</p>
            </div>
          </div>
          <p className="text-sm text-sand-100/70">
            Lieu de prière, de savoir et de solidarité au cœur de Creil.
          </p>
          <div className="flex gap-3">
            <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-gold-500 hover:text-emerald-900">
              <Icon.facebook width={18} height={18} />
            </a>
            <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-gold-500 hover:text-emerald-900">
              <Icon.instagram width={18} height={18} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <nav aria-label="Pied de page — navigation">
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold-400">
            Navigation
          </h3>
          <ul className="space-y-2.5 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-sand-100/75 transition hover:text-sand-50">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Liens & démarches (existants préservés) */}
        <nav aria-label="Pied de page — démarches">
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold-400">
            Démarches
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li><a href={LINKS.inscriptionCours} target="_blank" rel="noopener noreferrer" className="text-sand-100/75 transition hover:text-sand-50">Inscriptions Cours 2026/2027</a></li>
            <li><a href={LINKS.mouton} target="_blank" rel="noopener noreferrer" className="text-sand-100/75 transition hover:text-sand-50">Commander mon mouton — Aïd 2026</a></li>
            <li><a href={LINKS.cotisation} target="_blank" rel="noopener noreferrer" className="text-sand-100/75 transition hover:text-sand-50">Cotisation annuelle</a></li>
            <li><a href={LINKS.visiteVirtuelle} target="_blank" rel="noopener noreferrer" className="text-sand-100/75 transition hover:text-sand-50">Visite virtuelle</a></li>
          </ul>
        </nav>

        {/* Soutien */}
        <div>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-gold-400">
            Soutenir
          </h3>
          <p className="mb-4 text-sm text-sand-100/70">
            Faites un don pour soutenir la vie de la mosquée.
          </p>
          <a href={LINKS.don} target="_blank" rel="noopener noreferrer" className="btn-gold w-full">
            <Icon.heart width={16} height={16} /> Faire un don
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-sand-100/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.legalName} ({SITE.shortName}). Tous droits réservés.</p>
          <a href="/admin" className="transition hover:text-sand-50">Espace administration</a>
        </div>
      </div>
    </footer>
  );
}
