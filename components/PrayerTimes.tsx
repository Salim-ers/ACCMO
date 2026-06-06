import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { Icon } from "@/components/Icons";

// URL officielle Mawaqit de la Grande Mosquée Essalam de Creil.
const MAWAQIT_URL = "https://mawaqit.net/fr/m/essalam-creil";

export default function PrayerTimes() {
  return (
    <section id="horaires" className="container-x py-20 sm:py-28">
      <SectionHeading
        eyebrow="Horaires"
        title="Heures de prière"
        intro="Horaires officiels de la Grande Mosquée de Creil, synchronisés en direct via Mawaqit."
      />

      <Reveal y={36} className="mt-10">
        <div className="card-glow overflow-hidden rounded-3xl shadow-lift ring-1 ring-emerald-900/10">
          <iframe
            src={MAWAQIT_URL}
            title="Horaires de prière officiels — Mosquée Essalam de Creil (Mawaqit)"
            className="h-[600px] w-full sm:h-[640px]"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          />
        </div>
      </Reveal>

      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        <a
          href={MAWAQIT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          Ouvrir les horaires sur Mawaqit <Icon.arrow width={16} height={16} />
        </a>
        <p className="text-sm text-emerald-800/60">
          Source : Mawaqit. La Jumu&apos;a a lieu le vendredi — confirmez l&apos;heure exacte
          sur place.
        </p>
      </div>
    </section>
  );
}
