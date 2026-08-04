import type { ReactNode } from "react";

// En-tête de section : marqueur numéroté + titre + chapô, aligné à gauche,
// avec une éventuelle action alignée à droite sur grand écran.
// Le numéro sert de repère de lecture, pas de décor : il suit l'ordre réel
// des sections de la page.

export default function SectionHead({
  num,
  kicker,
  title,
  intro,
  action,
  invert = false,
  as: Tag = "h2",
}: {
  num: string;
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  invert?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={`flex flex-col gap-6 border-t pt-6 md:flex-row md:items-end md:justify-between md:gap-10 ${
        invert ? "border-[var(--rule-invert)]" : "border-[var(--rule)]"
      }`}
      data-reveal
    >
      <div className="max-w-2xl">
        <p className={`section-marker ${invert ? "!text-night-300" : ""}`}>
          <span className="num">{num}</span>
          <span>{kicker}</span>
        </p>
        <Tag
          className={`title-lg mt-4 ${invert ? "text-sand-50" : "text-night-900"}`}
        >
          {title}
        </Tag>
        {intro && (
          <p
            className={`mt-4 text-[16.5px] leading-relaxed ${
              invert ? "text-night-200" : "text-night-600"
            }`}
          >
            {intro}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 md:pb-1.5">{action}</div>}
    </div>
  );
}
