import type { SVGProps } from "react";

// Pictogrammes maison : trait fin constant, extrémités nettes, géométrie
// sobre. Aucun symbole décoratif (croissant orné, lanterne, dôme, main).

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
  "aria-hidden": true,
  focusable: "false" as const,
};

type P = SVGProps<SVGSVGElement>;

export const Icon = {
  menu: (p: P) => (
    <svg {...base} {...p}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  ),
  close: (p: P) => (
    <svg {...base} {...p}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  ),
  arrow: (p: P) => (
    <svg {...base} {...p}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  ),
  arrowUpRight: (p: P) => (
    <svg {...base} {...p}>
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  ),
  chevron: (p: P) => (
    <svg {...base} {...p}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  ),
  clock: (p: P) => (
    <svg {...base} {...p} strokeLinecap="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 2" />
    </svg>
  ),
  pin: (p: P) => (
    <svg {...base} {...p} strokeLinecap="round">
      <path d="M12 21c4.2-4.6 6.3-7.9 6.3-10.4A6.3 6.3 0 0 0 5.7 10.6C5.7 13.1 7.8 16.4 12 21z" />
      <circle cx="12" cy="10.4" r="2.3" />
    </svg>
  ),
  mail: (p: P) => (
    <svg {...base} {...p}>
      <rect x="3.5" y="5.5" width="17" height="13" />
      <path d="M3.5 7.5L12 13l8.5-5.5" />
    </svg>
  ),
  book: (p: P) => (
    <svg {...base} {...p}>
      <path d="M4 4.5h6.5A1.5 1.5 0 0 1 12 6v13a1.5 1.5 0 0 0-1.5-1.5H4z" />
      <path d="M20 4.5h-6.5A1.5 1.5 0 0 0 12 6v13a1.5 1.5 0 0 1 1.5-1.5H20z" />
    </svg>
  ),
  pen: (p: P) => (
    <svg {...base} {...p}>
      <path d="M4 20l1-4.5L15.8 4.7l3.5 3.5L8.5 19 4 20z" />
      <path d="M14 6.5l3.5 3.5" />
    </svg>
  ),
  list: (p: P) => (
    <svg {...base} {...p}>
      <path d="M4 6.5h3M4 12h3M4 17.5h3M10 6.5h10M10 12h10M10 17.5h10" />
    </svg>
  ),
  cube: (p: P) => (
    <svg {...base} {...p}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </svg>
  ),
  hand: (p: P) => (
    <svg {...base} {...p} strokeLinecap="round">
      <path d="M4 13.5V9a1.6 1.6 0 0 1 3.2 0v2.2" />
      <path d="M7.2 11.2V6.4a1.6 1.6 0 0 1 3.2 0v4.8" />
      <path d="M10.4 11.2V7.6a1.6 1.6 0 0 1 3.2 0v4.2" />
      <path d="M13.6 11.8v-2a1.6 1.6 0 0 1 3.2 0v5.4c0 3.2-2.2 5.6-5.4 5.6-3 0-4.8-1.6-5.9-4L4 13.5" />
    </svg>
  ),
  crescent: (p: P) => (
    <svg {...base} {...p} strokeLinecap="round">
      <path d="M19.2 15.4A8 8 0 0 1 9.4 4.9a8.4 8.4 0 1 0 9.8 10.5z" />
    </svg>
  ),
  check: (p: P) => (
    <svg {...base} {...p}>
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  ),
  star: (p: P) => (
    <svg {...base} {...p} fill="currentColor" stroke="none">
      <path d="M12 3l2.4 5.8L20.5 9l-4.6 4 1.4 6.3L12 16l-5.3 3.3L8.1 13 3.5 9l6.1-.2z" />
    </svg>
  ),
  facebook: (p: P) => (
    <svg {...base} {...p} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.2 8.2h2.3V5.4h-2.3a3.4 3.4 0 0 0-3.4 3.4v1.9H8.8v2.8h2v6.5h2.8v-6.5h2.1l.6-2.8h-2.7V8.8c0-.3.3-.6.6-.6z" />
    </svg>
  ),
  instagram: (p: P) => (
    <svg {...base} {...p} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.8" y="3.8" width="16.4" height="16.4" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="16.9" cy="7.1" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  info: (p: P) => (
    <svg {...base} {...p} strokeLinecap="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="7.8" r=".9" fill="currentColor" stroke="none" />
    </svg>
  ),
  home: (p: P) => (
    <svg {...base} {...p}>
      <path d="M4 10.5L12 4l8 6.5V20H4z" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  ),
  moon: (p: P) => (
    <svg {...base} {...p} strokeLinecap="round">
      <path d="M19.2 15.4A8 8 0 0 1 9.4 4.9a8.4 8.4 0 1 0 9.8 10.5z" />
    </svg>
  ),
  heart: (p: P) => (
    <svg {...base} {...p} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.3S4 15.4 4 9.9A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 8 2.5c0 5.5-8 10.4-8 10.4z" />
    </svg>
  ),
  hands: (p: P) => (
    <svg {...base} {...p} strokeLinecap="round">
      <path d="M12 3.5v8" />
      <path d="M8.5 7L12 3.5 15.5 7" />
      <path d="M4 14c0 4.1 3.6 7 8 7s8-2.9 8-7" />
    </svg>
  ),
  sheep: (p: P) => (
    <svg {...base} {...p} strokeLinecap="round">
      <circle cx="12" cy="13" r="5.5" />
      <path d="M9.5 11.5h.01M14.5 11.5h.01" />
      <path d="M9.5 19v2M14.5 19v2" />
    </svg>
  ),
  rings: (p: P) => (
    <svg {...base} {...p} strokeLinecap="round">
      <circle cx="9.5" cy="14" r="4.5" />
      <circle cx="14.5" cy="14" r="4.5" />
    </svg>
  ),
};

export type IconName = keyof typeof Icon;
