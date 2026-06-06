import type { SVGProps } from "react";

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type P = SVGProps<SVGSVGElement>;

export const Icon = {
  menu: (p: P) => (<svg {...base} {...p}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>),
  close: (p: P) => (<svg {...base} {...p}><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>),
  book: (p: P) => (<svg {...base} {...p}><path d="M4 5a2 2 0 0 1 2-2h12v17H6a2 2 0 0 1-2-2z" /><path d="M18 3v17" /><path d="M8 7h6M8 11h6" /></svg>),
  moon: (p: P) => (<svg {...base} {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>),
  heart: (p: P) => (<svg {...base} {...p}><path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" /></svg>),
  sheep: (p: P) => (<svg {...base} {...p}><circle cx="12" cy="13" r="6" /><path d="M8 11h.01M16 11h.01" /><path d="M6 9a2 2 0 1 1 1-3.7M18 9a2 2 0 1 0-1-3.7" /><path d="M9 19v2M15 19v2" /></svg>),
  rings: (p: P) => (<svg {...base} {...p}><circle cx="9" cy="14" r="5" /><circle cx="15" cy="14" r="5" /><path d="M9 9l1.5-3M15 9l-1.5-3" /></svg>),
  hands: (p: P) => (<svg {...base} {...p}><path d="M12 3v9" /><path d="M8 7l4-4 4 4" /><path d="M4 14c0 4 3.6 7 8 7s8-3 8-7" /></svg>),
  clock: (p: P) => (<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>),
  pin: (p: P) => (<svg {...base} {...p}><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>),
  mail: (p: P) => (<svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>),
  arrow: (p: P) => (<svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>),
  star: (p: P) => (<svg {...base} {...p} fill="currentColor" stroke="none"><path d="M12 2l2.6 6.3L21 9l-5 4.3L17.4 20 12 16.5 6.6 20 8 13.3 3 9l6.4-.7z" /></svg>),
  cube: (p: P) => (<svg {...base} {...p}><path d="M12 2 3 7v10l9 5 9-5V7z" /><path d="M3 7l9 5 9-5M12 12v10" /></svg>),
  facebook: (p: P) => (<svg {...base} {...p}><path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2l1-3h-3V8a1 1 0 0 1 1-1z" /></svg>),
  instagram: (p: P) => (<svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>),
};

export type IconName = keyof typeof Icon;
