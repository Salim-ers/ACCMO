// =============================================================
// Configuration centrale — Grande Mosquée de Creil · Essalam (ACCMO)
// Source unique de vérité : édite ici, jamais dans les composants.
//
// RÈGLE : aucune donnée inventée. Chaque information ci-dessous est
// issue du site officiel accmo.org, de la fiche Mawaqit de la mosquée
// ou des liens déjà en production. Ce qui n'est pas confirmé est
// explicitement marqué `null` et masqué à l'affichage.
// =============================================================

import type { Category } from "@/lib/categories";

export const SITE = {
  name: "Grande Mosquée de Creil — Essalam",
  shortName: "Essalam",
  tagline: "Grande Mosquée de Creil",
  legalName: "Association Culturelle et Cultuelle des Musulmans de l'Oise",
  association: "ACCMO",
  url: "https://accmo.org",
  description:
    "La Grande Mosquée de Creil — Essalam (ACCMO) : horaires de prière, école coranique Al Ghazali, annonces, visite virtuelle 360°, solidarité et démarches pour toute la communauté de Creil.",
  address: {
    // Source : données structurées du site officiel accmo.org.
    street: "31 rue Jean Moulin",
    zip: "60100",
    city: "Creil",
    country: "France",
  },
  // Source : fiche Mawaqit de la mosquée (identique à accmo.org).
  geo: { lat: 49.2495975, lng: 2.4631836 },
  email: "contact@accmo.org",
  // Non publié par l'association : reste masqué tant qu'il n'est pas confirmé.
  phone: null as string | null,
  social: {
    facebook: "https://www.facebook.com/mosqueecreil/?locale=fr_FR",
    instagram: "https://www.instagram.com/mosqueecreil/",
  },
} as const;

export const FULL_ADDRESS = `${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}`;

export const MAPS_QUERY = `${SITE.geo.lat},${SITE.geo.lng}`;
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;
export const DIRECTIONS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`;
export const MAPS_EMBED = `https://maps.google.com/maps?q=${MAPS_QUERY}&z=16&output=embed`;

// --- Liens externes existants (préservés à l'identique) ---
export const LINKS = {
  don: "https://donate.stripe.com/aFa14m5MG9ixbT62go2wU01",
  cotisation: "https://donate.stripe.com/aFa14m5MG9ixbT62go2wU01",
  mouton: "https://mosqueedecreil.kebchi.fr/",
  inscriptionCours: "https://inscription-madrassah.web.app/",
  visiteVirtuelle: "https://accmo.org/virtualtour/mosquee/",
  ecole: "https://alghazali.org/",
  mawaqit: "https://mawaqit.net/fr/m/essalam-creil",
} as const;

// --- Routes internes ---
export const ROUTES = {
  home: "/",
  mosquee: "/la-mosquee",
  horaires: "/horaires",
  ecole: "/ecole",
  annonces: "/annonces",
  visite: "/visite-virtuelle",
  contact: "/contact",
  don: "/soutenir",
  mentions: "/mentions-legales",
  confidentialite: "/confidentialite",
  admin: "/admin",
} as const;

// --- Navigation principale (par intention, pas par rubrique) ---
export const NAV: { label: string; href: string; desc: string }[] = [
  { label: "Découvrir", href: ROUTES.mosquee, desc: "La mosquée, son histoire, ses espaces" },
  { label: "Prier", href: ROUTES.horaires, desc: "Horaires du jour, Jumu'a, calendrier" },
  { label: "Apprendre", href: ROUTES.ecole, desc: "École Al Ghazali et inscriptions" },
  { label: "Vie de la mosquée", href: ROUTES.annonces, desc: "Annonces, événements, solidarité" },
  { label: "Nous contacter", href: ROUTES.contact, desc: "Adresse, itinéraire, écrire à l'association" },
];

// --- Accès rapides aux démarches (section « panneau d'orientation ») ---
export type Shortcut = {
  key: string;
  label: string;
  desc: string;
  href: string;
  external?: boolean;
  icon: string;
};

export const SHORTCUTS: Shortcut[] = [
  {
    key: "inscrire",
    label: "Inscrire un enfant",
    desc: "Ouverture des inscriptions à l'école coranique pour l'année 2026 / 2027.",
    href: LINKS.inscriptionCours,
    external: true,
    icon: "pen",
  },
  {
    key: "ecole",
    label: "École Al Ghazali",
    desc: "Le projet éducatif porté par l'association.",
    href: ROUTES.ecole,
    icon: "book",
  },
  {
    key: "annonces",
    label: "Consulter les annonces",
    desc: "Informations, rendez-vous et actions en cours.",
    href: ROUTES.annonces,
    icon: "list",
  },
  {
    key: "janaza",
    label: "Préparer une Janaza",
    desc: "La mosquée accueille les prières funéraires. Contactez l'association.",
    href: ROUTES.contact,
    icon: "crescent",
  },
  {
    key: "visite",
    label: "Visiter en 360°",
    desc: "Entrez dans la salle de prière depuis chez vous.",
    href: ROUTES.visite,
    icon: "cube",
  },
  {
    key: "don",
    label: "Faire un don",
    desc: "Don ponctuel ou cotisation annuelle, paiement sécurisé.",
    href: ROUTES.don,
    icon: "hand",
  },
  {
    key: "contact",
    label: "Contacter l'association",
    desc: "Une question, une demande, un projet.",
    href: ROUTES.contact,
    icon: "mail",
  },
  {
    key: "itineraire",
    label: "Obtenir un itinéraire",
    desc: FULL_ADDRESS,
    href: DIRECTIONS_LINK,
    external: true,
    icon: "pin",
  },
];

// --- Équipements confirmés par la mosquée sur sa fiche Mawaqit ---
// (womenSpace, janazaPrayer, aidPrayer, childrenCourses, adultCourses,
//  handicapAccessibility, ablutions, parking = true ; ramadanMeal = false)
export const FACILITIES: { label: string; note: string }[] = [
  { label: "Espace femmes", note: "Salle dédiée aux sœurs" },
  { label: "Salle d'ablutions", note: "Accessible aux horaires d'ouverture" },
  { label: "Accès PMR", note: "Bâtiment accessible aux personnes à mobilité réduite" },
  { label: "Stationnement", note: "Parking sur place" },
  { label: "Cours enfants", note: "École coranique et arabe" },
  { label: "Cours adultes", note: "Enseignement pour les grands" },
  { label: "Prière funéraire", note: "Janaza organisée sur demande" },
  { label: "Prière de l'Aïd", note: "Rassemblement des deux Aïd" },
];

// --- Événements récurrents (démarches ouvertes toute l'année) ---
export const RECURRING: {
  title: string;
  when: string;
  desc: string;
  href: string;
  cta: string;
  category: Category;
}[] = [
  {
    title: "Inscriptions aux cours 2026 / 2027",
    when: "Inscriptions ouvertes",
    desc: "Coran, arabe et sciences islamiques pour les enfants comme pour les adultes.",
    href: LINKS.inscriptionCours,
    cta: "S'inscrire",
    category: "Enseignement",
  },
  {
    title: "Cotisation annuelle des adhérents",
    when: "Toute l'année",
    desc: "La contribution qui couvre les charges de fonctionnement de la mosquée.",
    href: LINKS.cotisation,
    cta: "Contribuer",
    category: "Solidarité",
  },
  {
    title: "Commande de mouton — Aïd al-Adha",
    when: "Service saisonnier",
    desc: "Réservation auprès du service partenaire de la mosquée.",
    href: LINKS.mouton,
    cta: "Commander",
    category: "Événements",
  },
];

// --- Informations pratiques d'accès ---
// `null` = information non confirmée par l'association : rien n'est affiché
// tant que la valeur n'a pas été renseignée ici. Ne jamais deviner.
export const ACCESS = {
  parking: "Stationnement disponible sur place.",
  accessibility: "Bâtiment accessible aux personnes à mobilité réduite.",
  /** Ex. « Ligne 3, arrêt … » — à renseigner une fois vérifié auprès de l'ACCMO. */
  transport: null as string | null,
  /** Ex. « Ouverture des portes 15 min avant chaque prière » — à confirmer. */
  doorsOpening: null as string | null,
  hoursNote:
    "La mosquée ouvre pour les cinq prières quotidiennes ainsi que pour la Jumu‘a du vendredi. Les horaires suivent le calendrier ci-dessus.",
} as const;

// --- Chapitres « Histoire et mission » ---
// Formulations volontairement non chiffrées : aucune date de création,
// aucune statistique n'est publiée par l'association.
export const CHAPTERS: { num: string; title: string; text: string }[] = [
  {
    num: "I",
    title: "Une association, puis un lieu",
    text: "L'ACCMO — Association Culturelle et Cultuelle des Musulmans de l'Oise — porte la Grande Mosquée de Creil. Elle en assure la gestion, l'entretien et le fonctionnement quotidien, au service des habitants du bassin creillois.",
  },
  {
    num: "II",
    title: "La prière, au centre",
    text: "Cinq prières quotidiennes, le prêche du vendredi, les prières de l'Aïd et les prières funéraires : la mosquée rythme la semaine de la communauté et reste ouverte à toutes les générations.",
  },
  {
    num: "III",
    title: "La transmission",
    text: "L'enseignement du Coran, de la langue arabe et des sciences islamiques s'adresse aux enfants comme aux adultes. Le projet éducatif se prolonge à travers l'école Al Ghazali.",
  },
  {
    num: "IV",
    title: "La solidarité",
    text: "Accompagnement des familles, collectes de denrées, écoute et soutien aux plus démunis : la mosquée est aussi un point d'appui concret dans le quotidien du quartier.",
  },
  {
    num: "V",
    title: "Ce qui vient",
    text: "Améliorer l'accueil, développer les activités éducatives et faire de la mosquée un centre de vie ouvert : les projets avancent au rythme du soutien de la communauté.",
  },
];

// --- Mur d'actions ---
export const ACTIONS: { num: string; verb: string; text: string }[] = [
  {
    num: "01",
    verb: "Accompagner",
    text: "Écoute des familles, orientation dans les démarches, présence auprès de celles et ceux qui traversent une épreuve.",
  },
  {
    num: "02",
    verb: "Transmettre",
    text: "Cours de Coran, d'arabe et de sciences islamiques pour les enfants et les adultes, tout au long de l'année scolaire.",
  },
  {
    num: "03",
    verb: "Soutenir",
    text: "Collectes de denrées et actions de solidarité au profit des familles du quartier, en particulier pendant le Ramadan.",
  },
  {
    num: "04",
    verb: "Rassembler",
    text: "Jumu'a, prières de l'Aïd, conférences et rendez-vous qui réunissent la communauté au même endroit.",
  },
];

// --- Photographies réelles disponibles dans /public/photos ---
export const PHOTOS = {
  facade: {
    src: "/photos/mosquee-facade.jpg",
    alt: "La Grande Mosquée de Creil vue depuis sa cour : la salle de prière et son minaret",
  },
  salle: {
    src: "/photos/mosquee-salle.jpg",
    alt: "Salle de prière de la Mosquée Essalam, tapis et travées orientés vers le mihrab",
  },
  interieur: {
    src: "/photos/mosquee-interieur.png",
    alt: "Intérieur de la Mosquée Essalam de Creil sous la lumière naturelle",
  },
} as const;

// Logo officiel (hébergé sur accmo.org, déjà autorisé dans next.config).
export const LOGO =
  "https://accmo.org/wp-content/uploads/2023/04/cropped-cropped-logo-creil-150x150-1.webp";

// --- Pied de page organisé par usages ---
export const FOOTER_GROUPS: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    title: "Je viens prier",
    links: [
      { label: "Horaires du jour", href: ROUTES.horaires },
      { label: "Heure de la Jumu'a", href: `${ROUTES.horaires}#jumua` },
      { label: "Calendrier Mawaqit", href: LINKS.mawaqit, external: true },
      { label: "Itinéraire vers la mosquée", href: DIRECTIONS_LINK, external: true },
    ],
  },
  {
    title: "Je souhaite apprendre",
    links: [
      { label: "École Al Ghazali", href: ROUTES.ecole },
      { label: "Inscriptions 2026 / 2027", href: LINKS.inscriptionCours, external: true },
      { label: "Cours pour adultes", href: `${ROUTES.ecole}#adultes` },
    ],
  },
  {
    title: "Je cherche une démarche",
    links: [
      { label: "Préparer une Janaza", href: ROUTES.contact },
      { label: "Commande de mouton — Aïd", href: LINKS.mouton, external: true },
      { label: "Visite virtuelle 360°", href: ROUTES.visite },
      { label: "Écrire à l'association", href: ROUTES.contact },
    ],
  },
  {
    title: "Je veux soutenir",
    links: [
      { label: "Faire un don", href: ROUTES.don },
      { label: "Cotisation annuelle", href: LINKS.cotisation, external: true },
      { label: "Les actions de la mosquée", href: `${ROUTES.mosquee}#actions` },
    ],
  },
];

// Service saisonnier (Aïd) — activé depuis /admin, une fois par an.
export const AID_SERVICE = {
  title: "Aïd — Commande de mouton",
  desc: "Réservez votre mouton pour l'Aïd auprès du service partenaire de la mosquée.",
  href: LINKS.mouton,
  cta: "Commander un mouton",
};
