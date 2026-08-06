import Image from "next/image";
import Link from "next/link";
import {
  DIRECTIONS_LINK,
  FOOTER_GROUPS,
  FULL_ADDRESS,
  LOGO,
  ROUTES,
  SITE,
} from "@/lib/site";
import type { PrayerDay } from "@/lib/prayer";
import FooterPrayerLine from "@/components/FooterPrayerLine";
import { Icon } from "@/components/Icons";

// Pied de page organisé par intentions d'usage — « je viens prier »,
// « je souhaite apprendre » — et non par duplication de la navigation.

export default function SiteFooter({
  prayerDay,
  aidEnabled = false,
}: {
  prayerDay: PrayerDay | null;
  /** Les liens saisonniers (commande de mouton) restent masques hors saison. */
  aidEnabled?: boolean;
}) {
  const year = new Date().getFullYear();

  // Aplat de bleu nuit franc : aucune trame de fond ici. La respiration
  // vient des filets et de l'espacement, pas d'une texture.
  return (
    <footer className="on-dark bg-night-900 text-night-100">
      {/* ---- Phrase d'identité ---- */}
      <div className="shell border-b border-[var(--rule-invert)] py-14 sm:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-terra-400">
              {SITE.shortName}
            </p>
            <p className="title-lg mt-4 max-w-2xl text-sand-50">
              Un lieu pour prier,
              <br />
              apprendre et servir.
            </p>
          </div>
          <FooterPrayerLine prayerDay={prayerDay} />
        </div>
      </div>

      {/* ---- Liens par usages ---- */}
      <div className="shell grid gap-x-8 gap-y-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {FOOTER_GROUPS.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="text-[12px] font-bold uppercase tracking-[0.14em] text-terra-400">
              {group.title}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {group.links
                .filter((l) => !l.seasonal || aidEnabled)
                .map((l) => (
                <li key={`${group.title}-${l.label}`}>
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[14.5px] text-night-200 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      {l.label}
                      <Icon.arrowUpRight width={13} height={13} className="text-night-400" />
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      className="text-[14.5px] text-night-200 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* ---- Identité de l'association ---- */}
      <div className="shell grid gap-8 border-t border-[var(--rule-invert)] py-10 md:grid-cols-[1fr_auto] md:items-start">
        <div className="flex items-start gap-4">
          <Image
            src={LOGO}
            alt=""
            width={44}
            height={44}
            loading="lazy"
            className="h-11 w-11 shrink-0 object-contain"
          />
          <div>
            <p className="text-[15px] font-extrabold tracking-tight text-sand-50">
              {SITE.name}
            </p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-night-300">
              {SITE.legalName} ({SITE.association})
            </p>
            <a
              href={DIRECTIONS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-[13.5px] text-night-200 underline-offset-4 hover:text-white hover:underline"
            >
              <Icon.pin width={14} height={14} />
              {FULL_ADDRESS}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-1 block text-[13.5px] text-night-200 underline-offset-4 hover:text-white hover:underline"
            >
              {SITE.email}
            </a>
          </div>
        </div>

        <div className="flex gap-2.5 md:justify-end">
          <a
            href={SITE.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center border border-[var(--rule-invert)] text-night-200 transition-colors hover:border-sand-50 hover:bg-sand-50 hover:text-night-900"
          >
            <span className="sr-only">Facebook de la mosquée</span>
            <Icon.facebook width={18} height={18} />
          </a>
          <a
            href={SITE.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center border border-[var(--rule-invert)] text-night-200 transition-colors hover:border-sand-50 hover:bg-sand-50 hover:text-night-900"
          >
            <span className="sr-only">Instagram de la mosquée</span>
            <Icon.instagram width={18} height={18} />
          </a>
        </div>
      </div>

      {/* ---- Mentions ---- */}
      <div className="border-t border-[var(--rule-invert)]">
        <div className="shell flex flex-col gap-3 py-6 text-[12.5px] text-night-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.legalName}
          </p>
          <nav aria-label="Informations légales">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <li>
                <Link href={ROUTES.mentions} className="underline-offset-4 hover:text-white hover:underline">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href={ROUTES.confidentialite} className="underline-offset-4 hover:text-white hover:underline">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href={ROUTES.admin} className="text-night-300 underline-offset-4 hover:text-white hover:underline">
                  Administration
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
