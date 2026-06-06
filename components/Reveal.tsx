"use client";
import type React from "react";

import { useRef, type ReactNode, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  children: ReactNode;
  /** Décalage entre les enfants directs (effet "stagger"). 0 = un seul bloc. */
  stagger?: number;
  /** Sélecteur des éléments à animer (par défaut : enfants directs). */
  selector?: string;
  delay?: number;
  y?: number;
  as?: ElementType;
  className?: string;
};

export default function Reveal({
  children,
  stagger = 0,
  selector,
  delay = 0,
  y = 28,
  as: Tag = "div",
  className,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !ref.current) return;

      const targets =
        stagger > 0
          ? selector
            ? ref.current.querySelectorAll(selector)
            : Array.from(ref.current.children)
          : [ref.current];

      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.8,
        ease: "power3.out",
        delay,
        stagger: stagger || 0,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 82%",
          once: true,
        },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={className}>
      {children}
    </Tag>
  );
}
