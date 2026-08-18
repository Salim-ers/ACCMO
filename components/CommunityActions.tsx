import { ACTIONS } from "@/lib/site";

// Mur d'actions — quatre lignes numérotées qui disent ce que la mosquée
// fait concrètement. Aucune icône générique de main ou de cœur : le verbe
// porte l'information.

export default function CommunityActions() {
  return (
    <ol className="mt-12 border-t border-[var(--rule-invert)]">
      {ACTIONS.map((a, i) => (
        <li
          key={a.num}
          className="group grid grid-cols-1 gap-3 border-b border-[var(--rule-invert)] py-7 md:grid-cols-[auto_minmax(0,240px)_1fr] md:items-baseline md:gap-8 md:py-8"
          data-reveal
          style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}
        >
          <span className="tabular text-[13px] font-extrabold tracking-[0.14em] text-terra-400">
            {a.num}
          </span>
          <h3 className="text-[26px] font-extrabold leading-none tracking-tightest text-sand-50 md:text-[32px]">
            {a.verb}
          </h3>
          <p className="max-w-2xl text-[15px] leading-relaxed text-night-200">{a.text}</p>
        </li>
      ))}
    </ol>
  );
}
