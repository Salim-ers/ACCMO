import Reveal from "@/components/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal
      stagger={0.12}
      className={`flex flex-col gap-3 ${align === "center" ? "items-center text-center mx-auto max-w-2xl" : "max-w-2xl"}`}
    >
      <span className="eyebrow">
        <span className="h-px w-6 bg-gold-500" aria-hidden /> {eyebrow}
      </span>
      <h2 className="font-display text-3xl sm:text-4xl font-semibold text-emerald-900">
        {title}
      </h2>
      {intro && <p className="text-emerald-800/70 leading-relaxed">{intro}</p>}
    </Reveal>
  );
}
