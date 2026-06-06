import { SERVICES } from "@/lib/site";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { Icon, type IconName } from "@/components/Icons";

export default function Services() {
  return (
    <section id="services" className="container-x py-20 sm:py-28">
      <SectionHeading
        eyebrow="Services"
        title="Ce que propose la mosquée"
        intro="Un accompagnement spirituel, éducatif et social tout au long de l'année."
      />

      <Reveal stagger={0.08} selector="[data-svc]" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => {
          const Ico = Icon[s.icon as IconName] ?? Icon.heart;
          const external = s.href.startsWith("http");
          return (
            <a
              key={s.title}
              href={s.href}
              data-svc
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group card-glow flex flex-col gap-4 p-7 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-900/5 transition group-hover:bg-emerald-600 group-hover:text-sand-50">
                <Ico width={22} height={22} />
              </span>
              <h3 className="font-display text-xl font-semibold text-emerald-900">{s.title}</h3>
              <p className="text-sm leading-relaxed text-emerald-800/75">{s.desc}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                {s.cta}
                <Icon.arrow width={16} height={16} className="transition group-hover:translate-x-1" />
              </span>
            </a>
          );
        })}
      </Reveal>
    </section>
  );
}
