"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LINKS } from "@/lib/site";
import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@/components/Icons";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function PhotoCard({
  src,
  alt,
  label,
  className = "",
}: {
  src: string;
  alt: string;
  label: string;
  className?: string;
}) {
  return (
    <motion.div
      variants={item}
      className={`group relative overflow-hidden rounded-3xl ring-1 ring-emerald-900/10 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width:1024px) 100vw, 50vw"
        className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/10 to-transparent" />
      <span className="absolute bottom-4 left-5 inline-flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-widest text-sand-50">
        <span className="h-px w-5 bg-gold-400" /> {label}
      </span>
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="apropos" className="container-x py-20 sm:py-28">
      <SectionHeading
        eyebrow="La mosquée"
        title="Une maison spirituelle au cœur de Creil"
        intro="Depuis plus de 30 ans, la Mosquée Essalam rassemble les fidèles autour de la prière, du savoir et de l'entraide."
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-12 grid auto-rows-[170px] grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {/* Grande photo intérieure */}
        <PhotoCard
          src="/photos/mosquee-interieur.png"
          alt="Salle de prière de la Mosquée Essalam de Creil"
          label="Salle de prière"
          className="col-span-2 row-span-2"
        />

        {/* Chiffre clé */}
        <motion.div
          variants={item}
          className="glass-light flex flex-col justify-center rounded-3xl p-6 text-emerald-900 ring-1 ring-emerald-900/10"
        >
          <span className="font-mega text-4xl font-bold text-emerald-700">30+</span>
          <span className="mt-1 text-xs uppercase tracking-widest text-emerald-800/70">ans au service de la communauté</span>
        </motion.div>

        {/* Chiffre clé or */}
        <motion.div
          variants={item}
          className="flex flex-col justify-center rounded-3xl bg-emerald-900 p-6 text-sand-50 ring-1 ring-emerald-900/20"
        >
          <span className="font-mega text-4xl font-bold text-gold-400">5</span>
          <span className="mt-1 text-xs uppercase tracking-widest text-sand-100/70">prières quotidiennes + Jumu&apos;a</span>
        </motion.div>

        {/* Texte de présentation */}
        <motion.div
          variants={item}
          className="col-span-2 flex flex-col justify-center rounded-3xl bg-sand-100 p-7 ring-1 ring-emerald-900/10"
        >
          <p className="font-arabic text-lg text-gold-600">السلام عليكم</p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-900/80">
            Lieu de culte, école coranique et espace de solidarité, la mosquée accueille
            chacun dans un esprit de fraternité, d&apos;apprentissage et de paix —
            <span className="font-semibold text-emerald-800"> hommes, femmes et enfants.</span>
          </p>
        </motion.div>

        {/* Photo mihrab (haute) */}
        <PhotoCard
          src="/photos/mosquee-mihrab.png"
          alt="Mihrab et minbar de la mosquée"
          label="Le mihrab"
          className="row-span-2"
        />

        {/* Photo extérieure */}
        <PhotoCard
          src="/photos/mosquee-exterieur.png"
          alt="Façade et minaret de la Mosquée Essalam de Creil"
          label="Le minaret"
          className="col-span-2"
        />

        {/* CTA visite virtuelle */}
        <motion.a
          variants={item}
          href={LINKS.visiteVirtuelle}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col justify-between rounded-3xl bg-gradient-to-br from-gold-500 to-gold-600 p-6 text-emerald-950 ring-1 ring-gold-600/30"
        >
          <Icon.cube width={28} height={28} />
          <span className="font-heading text-lg font-bold leading-tight">
            Visite virtuelle 360°
            <span className="mt-1 flex items-center gap-1 text-sm font-semibold opacity-80">
              Entrer <Icon.arrow width={14} height={14} className="transition group-hover:translate-x-1" />
            </span>
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}
