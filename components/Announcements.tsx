"use client";

import { useEffect, useState } from "react";
import type { Announcement } from "@/lib/announcements";
import { EVENTS } from "@/lib/site";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { Icon } from "@/components/Icons";

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

export default function Announcements() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="annonces" className="pattern-light bg-sand-100/40 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Vie de la mosquée"
          title="Annonces & Événements"
          intro="Dernières nouvelles, rendez-vous et inscriptions de la communauté."
        />

        {/* Annonces dynamiques */}
        {loading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card h-40 animate-pulse bg-white/70" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <Reveal stagger={0.1} selector="[data-ann]" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <article
                key={a.id}
                data-ann
                className={`card flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift ${
                  a.featured ? "ring-2 ring-gold-500" : ""
                }`}
              >
                {a.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.image} alt={a.title} loading="lazy" className="h-44 w-full object-cover" />
                )}
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center justify-between">
                    <time className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                      {formatDate(a.date)}
                    </time>
                    {a.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/15 px-2.5 py-1 text-[11px] font-semibold text-gold-600">
                        <Icon.star width={12} height={12} /> À la une
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-emerald-900">{a.title}</h3>
                  <p className="text-sm leading-relaxed text-emerald-800/75">{a.body}</p>
                  {a.link && (
                    <a
                      href={a.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex w-fit items-center gap-1.5 pt-1 text-sm font-semibold text-emerald-600 hover:text-emerald-800"
                    >
                      {a.linkLabel || "En savoir plus"}
                      <Icon.arrow width={16} height={16} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </Reveal>
        ) : null}

        {/* Rendez-vous & inscriptions (récurrents) */}
        <h3 className="mt-14 flex items-center gap-2 font-heading text-lg font-bold uppercase tracking-widest text-emerald-700">
          <span className="h-px w-6 bg-gold-500" /> Rendez-vous & inscriptions
        </h3>
        <Reveal stagger={0.1} selector="[data-evt]" className="mt-6 grid gap-5 lg:grid-cols-3">
          {EVENTS.map((e) => (
            <article key={e.title} data-evt className="card flex flex-col gap-3 overflow-hidden p-7">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-sand-50">
                <Icon.star width={12} height={12} className="text-gold-400" /> {e.date}
              </span>
              <h4 className="font-display text-2xl font-semibold text-emerald-900">{e.title}</h4>
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
