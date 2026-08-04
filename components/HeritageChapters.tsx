import { CHAPTERS } from "@/lib/site";

// Histoire et mission racontées en chapitres numérotés plutôt qu'en
// « paragraphe + trois statistiques ». Aucun chiffre décoratif : rien
// n'est avancé qui ne soit vérifiable.

export default function HeritageChapters() {
  return (
    <ol className="mt-12 grid gap-x-12 gap-y-0 md:grid-cols-2">
      {CHAPTERS.map((c, i) => (
        <li
          key={c.num}
          className="group flex gap-5 border-t border-[var(--rule)] py-7 first:border-t-0 md:border-t md:first:border-t"
          data-reveal
          style={{ ["--reveal-delay" as string]: `${i * 50}ms` }}
        >
          <span
            className="tabular w-9 shrink-0 pt-1 text-[13px] font-extrabold tracking-widest text-terra-600"
            aria-hidden
          >
            {c.num}
          </span>
          <div className="min-w-0">
            <h3 className="text-[19px] font-extrabold leading-tight tracking-tight text-night-900">
              {c.title}
            </h3>
            <p className="mt-2.5 text-[15.5px] leading-relaxed text-night-600">{c.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
