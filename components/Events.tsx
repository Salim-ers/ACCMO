import { EVENTS } from "@/lib/site";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { Icon } from "@/components/Icons";

export default function Events() {
  return (
    <section id="evenements" className="pattern-light bg-sand-100/40 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Agenda"
          title="Événements & inscriptions"
          intro="Les rendez-vous importants et les démarches à ne pas manquer."
        />

        <Reveal stagger={0.1} selector="[data-evt]" className="mt-12 grid gap-5 lg:grid-cols-3">
          {EVENTS.map((e) => (
            <article
              key={e.title}
              data-evt
              className="card flex flex-col gap-3 overflow-hidden p-7"
            >
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-sand-50">
                <Icon.star width={12} height={12} className="text-gold-400" /> {e.date}
              </span>
              <h3 className="font-display text-2xl font-semibold text-emerald-900">{e.title}</h3>
              <p className="text-sm leading-relaxed text-emerald-800/75">{e.desc}</p>
              <a
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-2 w-fit !py-2.5 !px-5"
              >
                {e.cta} <Icon.arrow width={16} height={16} />
              </a>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
