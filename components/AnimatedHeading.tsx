"use client";

import { useEffect, useState, type CSSProperties } from "react";

const CHAR_DELAY = 30; // ms entre chaque caractère
const INITIAL_DELAY = 200; // ms avant le début
const CHAR_DURATION = 500; // ms par caractère

/**
 * Titre animé caractère par caractère :
 * chaque lettre part de opacity 0 / translateX(-18px) vers sa position finale,
 * avec un délai progressif (ligne puis caractère).
 */
export default function AnimatedHeading({
  text,
  className = "",
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const lines = text.split("\n");

  return (
    <h1 className={className} style={style}>
      {lines.map((line, lineIndex) => {
        const lineLength = line.length;
        return (
          <span key={lineIndex} className="block">
            {Array.from(line).map((char, charIndex) => {
              const delay =
                INITIAL_DELAY + lineIndex * lineLength * CHAR_DELAY + charIndex * CHAR_DELAY;
              return (
                <span
                  key={charIndex}
                  className="inline-block"
                  style={{
                    opacity: show ? 1 : 0,
                    transform: show ? "translateX(0)" : "translateX(-18px)",
                    transitionProperty: "opacity, transform",
                    transitionDuration: `${CHAR_DURATION}ms`,
                    transitionDelay: `${delay}ms`,
                  }}
                >
                  {char === " " ? " " : char}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
}
