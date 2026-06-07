"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SERVICES, AID_SERVICE } from "@/lib/site";
import SectionHeading from "@/components/SectionHeading";
import { Icon, type IconName } from "@/components/Icons";

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function About() {
  const [aidEnabled, setAidEnabled] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => setAidEnabled(!!s?.aidEnabled))
      .catch(() => {});
  }, []);

  const services = aidEnabled ? [...SERVICES, AID_SERVICE] : SERVICES;

  return (
    <section id="apropos" className="container-x py-20 sm:py-28">
      <SectionHeading
        eyebrow="La mosquée"
        title="Une maison spirituelle au cœur de Creil"
        intro="Depuis plus de 30 ans, la Mosquée Essalam rassemble les fidèles autour de la prière, du savoir et de l'entraide."
      />

      <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-2">
        {/* Photo salle de prière */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="group relative min-h-[460px] overflow-hidden rounded-3xl ring-1 ring-emerald-900/10"
        >
          <Image
            src="/photos/mosquee-interieur.png"
            alt="Salle de prière de la Mosquée Essalam de Creil"
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-950/10 to-transparent" />
          {/* stats sur la photo */}
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
            <span className="inline-flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-widest text-sand-50">
              <span className="h-px w-5 bg-gold-400" /> Salle de prière
            </span>
            <div className="flex gap-5 text-right">
              <div>
                <p className="font-mega text-2xl font-bold text-gold-400">30+</p>
                <p className="text-[10px] uppercase tracking-wider text-sand-100/80">ans</p>
              </div>
              <div>
                <p className="font-mega text-2xl font-bold text-gold-400">5</p>
                <p className="text-[10px] uppercase tracking-wider text-sand-100/80">prières/j</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Description + services */}
        <div className="flex flex-col">
          <p className="font-arabic text-xl text-gold-600">السلام عليكم ورحمة الله</p>
          <p className="mt-3 leading-relaxed text-emerald-900/85">
            La Grande Mosquée de Creil — <strong>Essalam</strong> est un lieu de prière, de
            transmission du savoir et de solidarité, qui accueille
            <strong> hommes, femmes et enfants</strong> dans un esprit de fraternité et de paix.
            Salle de prière spacieuse, école coranique et actions sociales rythment la vie de la
            communauté tout au long de l&apos;année.
          </p>
          <p className="mt-3 leading-relaxed text-emerald-800/75">
            Voici ce que la mosquée propose au quotidien :
          </p>

          {/* Liste des services */}
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ staggerChildren: 0.06 }}
            className="mt-4 flex flex-col gap-2"
          >
            {services.map((s) => {
              const Ico = Icon[s.icon as IconName] ?? Icon.heart;
              const external = s.href.startsWith("http");
              return (
                <motion.li key={s.title} variants={item}>
                  <a
                    href={s.href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-3 rounded-xl p-3 ring-1 ring-emerald-900/5 transition hover:bg-emerald-50"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-sand-50">
                      <Ico width={18} height={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-heading text-sm font-bold text-emerald-900">{s.title}</span>
                      <span className="block truncate text-xs text-emerald-800/70">{s.desc}</span>
                    </span>
                    <Icon.arrow width={16} height={16} className="shrink-0 text-emerald-500 transition group-hover:translate-x-1" />
                  </a>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
