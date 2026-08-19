"use client";

import { useEffect, useState } from "react";
import { LOGO, SITE } from "@/lib/site";

// Écran de chargement — logo de la mosquée sur fond sable, le temps que la
// page soit réellement prête.
//
// Trois règles, pour qu'il reste honnête et jamais bloquant :
//
// 1. Aucun délai artificiel, aucun pourcentage inventé. Le voile se retire
//    à l'événement `load` du navigateur, c'est-à-dire quand la page est
//    vraiment affichable — pas une seconde de plus, pas une de moins.
// 2. Une sécurité de 2,5 s : si une ressource tierce ne répond jamais,
//    l'événement `load` n'arrive pas et le voile doit partir quand même.
//    Il ne peut donc jamais retenir un visiteur devant un écran vide.
// 3. Il n'existe que si JavaScript est disponible (règle `.js` dans la
//    feuille de style) : sans JS, rien ne pourrait le retirer.
//
// Le composant est rendu côté serveur, donc présent dès le premier octet de
// HTML : le voile couvre la page avant qu'elle ne s'affiche, et non après.

/** Sécurité : au-delà, on retire le voile même si `load` n'est pas venu. */
const SECURITE_MS = 2500;
/** Doit correspondre à la transition CSS de `.site-loader`. */
const FONDU_MS = 500;

export default function SiteLoader() {
  const [pret, setPret] = useState(false);
  const [retire, setRetire] = useState(false);

  useEffect(() => {
    let annule = false;
    const terminer = () => {
      if (!annule) setPret(true);
    };

    // Hydratation plus rapide que le chargement des images : on vérifie
    // l'état courant avant de s'abonner, sinon l'événement est déjà passé.
    if (document.readyState === "complete") {
      terminer();
    } else {
      window.addEventListener("load", terminer);
    }
    const securite = window.setTimeout(terminer, SECURITE_MS);

    return () => {
      annule = true;
      window.clearTimeout(securite);
      window.removeEventListener("load", terminer);
    };
  }, []);

  // On attend la fin du fondu avant de retirer le nœud du document, pour ne
  // pas couper l'animation net.
  useEffect(() => {
    if (!pret) return;
    const id = window.setTimeout(() => setRetire(true), FONDU_MS);
    return () => window.clearTimeout(id);
  }, [pret]);

  if (retire) return null;

  return (
    <div
      className={`site-loader${pret ? " is-done" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Chargement du site"
    >
      {/*
        Balise <img> native plutôt que next/image : ce logo doit être demandé
        par l'analyseur du navigateur dès la lecture du HTML, sans passer par
        le pipeline d'optimisation qui le retarderait d'un aller-retour.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO}
        alt=""
        width={96}
        height={96}
        className="site-loader-logo"
        aria-hidden
      />
      <p className="site-loader-name">{SITE.shortName}</p>
      {/*
        Indicateur indéterminé : il signale une activité, il ne prétend pas
        mesurer une progression que nous ne connaissons pas.
      */}
      <span className="site-loader-rail" aria-hidden>
        <span className="site-loader-bar" />
      </span>
      <span className="sr-only">Chargement en cours…</span>
    </div>
  );
}
