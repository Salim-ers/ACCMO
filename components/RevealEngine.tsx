"use client";

import { useEffect } from "react";

// Un seul observateur pour toute la page : les sections restent des
// composants serveur et se contentent de porter l'attribut `data-reveal`.
// Sans JavaScript ou en « mouvement réduit », le contenu reste visible
// (la règle CSS est neutralisée par la media query correspondante).
//
// Nuance importante pour la navigation interne : au premier chargement, tout
// le monde se révèle, y compris ce qui est déjà à l'écran — c'est l'entrée en
// scène du site. Mais lors d'un changement de page, le contenu inséré qui se
// trouve déjà dans la fenêtre est affiché SANS animation. Sinon chaque appui
// sur la barre d'accès rapide donnait une page vide pendant une fraction de
// seconde, puis un fondu de 0,65 s : sur téléphone, cela se ressent comme une
// lenteur alors que la page est déjà là.

export default function RevealEngine() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    /**
     * Affiche immédiatement, sans transition : la classe est posée avant que
     * le navigateur ne calcule le style du nœud fraîchement inséré, il n'y a
     * donc pas d'état intermédiaire à animer.
     */
    const afficherDirect = (el: Element) => {
      const r = el.getBoundingClientRect();
      if (r.top >= window.innerHeight || r.bottom <= 0) return false;
      el.classList.add("is-in");
      return true;
    };

    const observe = (root: ParentNode, direct: boolean) =>
      root.querySelectorAll?.("[data-reveal]:not(.is-in)").forEach((el) => {
        if (direct && afficherDirect(el)) return;
        io.observe(el);
      });

    // Premier rendu : animation complète, c'est l'arrivée sur le site.
    observe(document, false);

    // Contenu inséré ensuite (changement de page, annonces chargées après
    // coup) : ce qui est déjà visible s'affiche sans fondu.
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          const el = n as Element;
          if (el.hasAttribute("data-reveal") && !afficherDirect(el)) io.observe(el);
          observe(el, true);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
