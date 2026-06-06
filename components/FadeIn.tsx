"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Apparition en fondu après un délai configurable (ms). */
export default function FadeIn({
  children,
  delay = 0,
  duration = 1000,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), delay);
    return () => window.clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`transition-opacity ${className}`}
      style={{ transitionDuration: `${duration}ms`, opacity: show ? 1 : 0 }}
    >
      {children}
    </div>
  );
}
