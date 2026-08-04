"use client";

import { useEffect } from "react";

// Un seul observateur pour toute la page : les sections restent des
// composants serveur et se contentent de porter l'attribut `data-reveal`.
// Sans JavaScript ou en « mouvement réduit », le contenu reste visible
// (la règle CSS est neutralisée par la media query correspondante).

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

    const observe = (root: ParentNode) =>
      root.querySelectorAll?.("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));

    observe(document);

    // Les annonces arrivent après le premier rendu : on surveille le DOM.
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          const el = n as Element;
          if (el.hasAttribute("data-reveal")) io.observe(el);
          observe(el);
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
