"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SERVICES, AID_SERVICE } from "@/lib/site";
import SectionHeading from "@/components/SectionHeading";
import { Icon, type IconName } from "@/components/Icons";

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function Services() {
  const [aidEnabled, setAidEnabled] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => setAidEnabled(!!s?.aidEnabled))
      .catch(() => {});
  }, []);

  const list = aidEnabled ? [...SERVICES, AID_SERVICE] : SERVICES;

  return (
    <section id="services" className="container-x py-20 sm:py-28">
      <SectionHeading
        eyebrow="Services"
        title="Ce que propose la mosquée"
        intro="Un accompagnement spirituel, éducatif et social tout au long de l'année."
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ staggerChildren: 0.07 }}
        className="mt-12 flex flex-col gap-4"
      >
        {list.map((s) => {
          const Ico = Icon[s.icon as IconName] ?? Icon.heart;
          const external = s.href.startsWith("http");
          return (
            <motion.a
              key={s.title}
              variants={item}
              href={s.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="card-glow group flex items-center gap-5 p-5 transition hover:-translate-y-0.5 hover:shadow-lift sm:p-6"
            >
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-900/5 transition group-hover:bg-emerald-600 group-hover:text-sand-50">
                <Ico width={24} height={24} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-lg font-bold text-emerald-900 sm:text-xl">{s.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-emerald-800/75">{s.desc}</p>
              </div>
              <span className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-emerald-600 sm:inline-flex">
                {s.cta}
                <Icon.arrow width={16} height={16} className="transition group-hover:translate-x-1" />
              </span>
            </motion.a>
          );
        })}
      </motion.div>
    </section>
  );
}
