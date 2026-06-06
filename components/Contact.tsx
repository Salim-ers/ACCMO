import { SITE } from "@/lib/site";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { Icon } from "@/components/Icons";

export default function Contact() {
  const mapsQuery = encodeURIComponent(
    `Grande Mosquée de Creil, ${SITE.address.zip} ${SITE.address.city}`
  );

  return (
    <section id="contact" className="pattern-light bg-sand-100/40 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Nous trouver"
          title="Contact & localisation"
          intro="Rendez-nous visite ou contactez-nous pour toute question."
        />

        <Reveal stagger={0.12} className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="card flex flex-col gap-5 p-7">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon.pin width={20} height={20} />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-emerald-900">Adresse</h3>
                <p className="text-sm text-emerald-800/75">
                  {SITE.address.zip} {SITE.address.city}, {SITE.address.country}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon.mail width={20} height={20} />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-emerald-900">Email</h3>
                <a href={`mailto:${SITE.email}`} className="text-sm text-emerald-600 underline-offset-2 hover:underline">
                  {SITE.email}
                </a>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-sand-50 transition hover:bg-emerald-800">
                <Icon.facebook width={18} height={18} />
              </a>
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-sand-50 transition hover:bg-emerald-800">
                <Icon.instagram width={18} height={18} />
              </a>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-2 w-fit"
            >
              Itinéraire <Icon.arrow width={16} height={16} />
            </a>
          </div>

          <div className="card overflow-hidden p-0">
            <iframe
              title="Carte — Grande Mosquée de Creil"
              className="h-full min-h-[320px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${mapsQuery}&output=embed`}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
