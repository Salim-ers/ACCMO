import Image from "next/image";
import { LINKS, PHOTOS } from "@/lib/site";
import { Icon } from "@/components/Icons";

// Section éducation — fond bleu brumeux, photographie documentaire d'un côté,
// discours de l'autre, et une frise de parcours qui explique la démarche.

const STEPS = ["Découvrir", "S’inscrire", "Être accompagné", "Progresser"];

const TEACHING = [
  { title: "Coran", desc: "Lecture, mémorisation et règles de récitation." },
  { title: "Langue arabe", desc: "Lire, écrire et comprendre la langue du Coran." },
  { title: "Sciences islamiques", desc: "Les fondements, expliqués avec méthode." },
];

export default function SchoolFeature() {
  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-[47fr_53fr] lg:items-center lg:gap-14">
      {/* Photographie documentaire */}
      <div className="group relative" data-reveal>
        <div className="frame frame-shift aspect-[4/3] lg:aspect-[5/6]">
          <Image
            src={PHOTOS.interieur.src}
            alt="Espace d’enseignement de la Mosquée Essalam de Creil"
            fill
            quality={78}
            sizes="(max-width: 1023px) 100vw, 47vw"
            className="object-cover"
          />
        </div>
        <p className="mt-3 text-[12.5px] text-night-600">
          Les cours se tiennent dans les espaces de la mosquée, à Creil.
        </p>
      </div>

      {/* Discours */}
      <div data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
        <h3 className="title-md text-night-900">
          Une école portée par la mosquée,
          <br className="hidden sm:block" /> pour les enfants comme pour les adultes.
        </h3>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-night-700">
          L’enseignement est au cœur du projet de l’association. La madrassah accueille les
          élèves tout au long de l’année scolaire, et le projet éducatif se prolonge à
          travers l’école Al&nbsp;Ghazali.
        </p>

        {/* Informations clés */}
        <dl className="mt-8 border-t border-[var(--rule-strong)]">
          {TEACHING.map((t) => (
            <div
              key={t.title}
              className="flex flex-col gap-1 border-b border-[var(--rule)] py-3.5 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <dt className="w-44 shrink-0 text-[15px] font-bold text-night-900">
                {t.title}
              </dt>
              <dd className="text-[14.5px] leading-relaxed text-night-600">{t.desc}</dd>
            </div>
          ))}
          <div
            id="adultes"
            className="flex flex-col gap-1 border-b border-[var(--rule)] py-3.5 sm:flex-row sm:items-baseline sm:gap-6"
          >
            <dt className="w-44 shrink-0 text-[15px] font-bold text-night-900">Publics</dt>
            <dd className="text-[14.5px] leading-relaxed text-night-600">
              Cours pour les enfants et cours pour les adultes.
            </dd>
          </div>
          <div className="flex flex-col gap-1 border-b border-[var(--rule)] py-3.5 sm:flex-row sm:items-baseline sm:gap-6">
            <dt className="w-44 shrink-0 text-[15px] font-bold text-night-900">
              Inscriptions
            </dt>
            <dd className="text-[14.5px] leading-relaxed text-night-600">
              Ouvertes pour l’année 2026 / 2027, en ligne.
            </dd>
          </div>
        </dl>

        {/* Frise du parcours */}
        <ol className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2" aria-label="Parcours d’inscription">
          {STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-night-800">
                <span className="tabular mr-1.5 text-terra-600">{i + 1}</span>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <Icon.arrow width={15} height={15} className="text-night-400" aria-hidden />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={LINKS.inscriptionCours}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Inscrire un enfant
            <Icon.arrowUpRight width={16} height={16} className="arw" />
          </a>
          <a
            href={LINKS.ecole}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Découvrir l’école Al Ghazali
          </a>
        </div>
      </div>
    </div>
  );
}
