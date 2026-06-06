"use client";

import { useEffect, useState } from "react";
import type { Announcement } from "@/lib/announcements";
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
          title="Annonces & communiqués"
          intro="Restez informé des dernières nouvelles, collectes et événements de la communauté."
        />

        {loading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card h-40 animate-pulse bg-white/70" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="mt-10 text-emerald-800/60">Aucune annonce pour le moment.</p>
        ) : (
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
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    className="h-44 w-full object-cover"
                  />
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
                  <h3 className="font-display text-xl font-semibold text-emerald-900">
                    {a.title}
                  </h3>
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
        )}
      </div>
    </section>
  );
}
