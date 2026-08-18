import {
  ACCESS,
  DIRECTIONS_LINK,
  FULL_ADDRESS,
  MAPS_EMBED,
  PHONE_HREF,
  SITE,
} from "@/lib/site";
import { Icon } from "@/components/Icons";

// Localisation pensée comme un outil pratique : ce dont on a besoin quand
// on cherche à venir, dans l'ordre où on en a besoin. Composition
// horizontale asymétrique — informations à gauche, plan large à droite.

export default function LocationSection() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-[var(--rule)] bg-[var(--rule)] lg:grid-cols-[40fr_60fr]">
      {/* ---- Informations ---- */}
      <div className="bg-white p-7 sm:p-9" data-reveal>
        <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-night-500">
          Adresse
        </h3>
        <p className="mt-3 text-[22px] font-extrabold leading-tight tracking-tight text-night-900">
          {SITE.address.street}
          <br />
          {SITE.address.zip} {SITE.address.city}
        </p>

        <a href={DIRECTIONS_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6 w-full sm:w-auto">
          <Icon.pin width={17} height={17} />
          Démarrer l’itinéraire
        </a>

        <dl className="mt-8 border-t border-[var(--rule)]">
          <div className="border-b border-[var(--rule)] py-4">
            <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-night-500">
              Venir en voiture
            </dt>
            <dd className="mt-1.5 text-[14.5px] leading-relaxed text-night-700">
              {ACCESS.parking}
            </dd>
          </div>

          <div className="border-b border-[var(--rule)] py-4">
            <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-night-500">
              Accessibilité
            </dt>
            <dd className="mt-1.5 text-[14.5px] leading-relaxed text-night-700">
              {ACCESS.accessibility}
            </dd>
          </div>

          {ACCESS.transport && (
            <div className="border-b border-[var(--rule)] py-4">
              <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-night-500">
                Transports à proximité
              </dt>
              <dd className="mt-1.5 text-[14.5px] leading-relaxed text-night-700">
                {ACCESS.transport}
              </dd>
            </div>
          )}

          <div className="border-b border-[var(--rule)] py-4">
            <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-night-500">
              Horaires d’ouverture
            </dt>
            <dd className="mt-1.5 text-[14.5px] leading-relaxed text-night-700">
              {ACCESS.hoursNote}
              {ACCESS.doorsOpening ? ` ${ACCESS.doorsOpening}` : ""}
            </dd>
          </div>

          <div className="border-b border-[var(--rule)] py-4">
            <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-night-500">
              Nous joindre
            </dt>
            <dd className="mt-1.5 flex flex-col gap-1">
              {/* Le téléphone d'abord : c'est ce que cherchent en premier les
                  personnes qui ne passent pas par un formulaire. */}
              {SITE.phone && PHONE_HREF && (
                <a
                  href={PHONE_HREF}
                  className="inline-flex min-h-[32px] items-center gap-2 text-[19px] font-extrabold tracking-tight text-night-900 hover:text-terra-600"
                >
                  <Icon.phone width={18} height={18} className="shrink-0 text-terra-600" />
                  {SITE.phone}
                </a>
              )}
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex min-h-[28px] items-center text-[15px] font-semibold text-night-900 underline underline-offset-4 hover:text-terra-600"
              >
                {SITE.email}
              </a>
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex gap-2.5">
          <a
            href={SITE.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center border border-[var(--rule)] text-night-700 transition-colors hover:border-night-900 hover:bg-night-900 hover:text-sand-50"
          >
            <span className="sr-only">Facebook de la mosquée</span>
            <Icon.facebook width={18} height={18} />
          </a>
          <a
            href={SITE.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center border border-[var(--rule)] text-night-700 transition-colors hover:border-night-900 hover:bg-night-900 hover:text-sand-50"
          >
            <span className="sr-only">Instagram de la mosquée</span>
            <Icon.instagram width={18} height={18} />
          </a>
        </div>
      </div>

      {/* ---- Plan ---- */}
      <div className="relative min-h-[340px] bg-night-100 lg:min-h-[520px]">
        <iframe
          title={`Plan d’accès — ${SITE.name}, ${FULL_ADDRESS}`}
          src={MAPS_EMBED}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full"
          style={{ border: 0 }}
        />
      </div>
    </div>
  );
}
