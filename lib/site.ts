// =============================================================
// Configuration centrale du site — édite ici sans toucher au reste.
// Tous les liens importants du site actuel ont été préservés.
// =============================================================

export const SITE = {
  name: "Grande Mosquée de Creil — Essalam",
  shortName: "ACCMO",
  legalName: "Association Culturelle et Cultuelle des Musulmans de l'Oise",
  url: "https://accmo.org",
  description:
    "La Grande Mosquée de Creil (Essalam) et le centre scolaire privé musulman de Creil proposent des services religieux, éducatifs et d'aide sociale.",
  address: {
    street: "—", // à compléter
    city: "Creil",
    zip: "60100",
    country: "France",
  },
  // Coordonnées approximatives de Creil ; affinez si besoin.
  geo: { lat: 49.2583, lng: 2.4806 },
  email: "contact@accmo.org",
  social: {
    facebook: "https://www.facebook.com/mosqueecreil/?locale=fr_FR",
    instagram: "https://www.instagram.com/mosqueecreil/",
  },
};

// --- Liens externes existants (préservés à l'identique) ---
export const LINKS = {
  don: "https://donate.stripe.com/aFa14m5MG9ixbT62go2wU01",
  cotisation: "https://donate.stripe.com/aFa14m5MG9ixbT62go2wU01",
  mouton: "https://mosqueedecreil.kebchi.fr/",
  inscriptionCours: "https://inscription-madrassah.web.app/",
  visiteVirtuelle: "https://accmo.org/virtualtour/mosquee/",
};

// --- Navigation principale ---
export const NAV = [
  { label: "Horaires", href: "#horaires" },
  { label: "Annonces", href: "#annonces" },
  { label: "Services", href: "#services" },
  { label: "Événements", href: "#evenements" },
  { label: "Visite virtuelle", href: "#visite-virtuelle" },
  { label: "Contact", href: "#contact" },
];

// --- Services de la mosquée ---
export const SERVICES = [
  {
    icon: "book",
    title: "École coranique (Madrassah)",
    desc: "Apprentissage du Coran, de l'arabe et des sciences islamiques pour enfants et adultes.",
    href: LINKS.inscriptionCours,
    cta: "S'inscrire 2026/2027",
  },
  {
    icon: "moon",
    title: "Prières & Jumu'a",
    desc: "Cinq prières quotidiennes et le prêche du vendredi dans une salle spacieuse et accueillante.",
    href: "#horaires",
    cta: "Voir les horaires",
  },
  {
    icon: "heart",
    title: "Aide sociale & solidarité",
    desc: "Accompagnement des familles, distributions de denrées et soutien aux plus démunis.",
    href: "#contact",
    cta: "Nous contacter",
  },
  {
    icon: "sheep",
    title: "Aïd — Commande de mouton",
    desc: "Réservez votre mouton pour l'Aïd 2026 en quelques clics via notre service partenaire.",
    href: LINKS.mouton,
    cta: "Commander un mouton",
  },
  {
    icon: "rings",
    title: "Mariages & cérémonies",
    desc: "Accompagnement pour les actes religieux et les grandes étapes de la vie.",
    href: "#contact",
    cta: "Prendre contact",
  },
  {
    icon: "hands",
    title: "Funérailles & Janaza",
    desc: "Soutien et organisation des prières funéraires dans le respect des rites.",
    href: "#contact",
    cta: "Prendre contact",
  },
];

// --- Événements (statiques ; les annonces datées sont gérées via /admin) ---
export const EVENTS = [
  {
    title: "Cours 2026 / 2027",
    date: "Inscriptions ouvertes",
    desc: "Les inscriptions à l'école coranique pour la nouvelle année sont ouvertes.",
    href: LINKS.inscriptionCours,
    cta: "S'inscrire",
  },
  {
    title: "Aïd al-Adha 2026",
    date: "Commande de mouton",
    desc: "Réservez votre mouton pour l'Aïd auprès de notre service partenaire.",
    href: LINKS.mouton,
    cta: "Commander",
  },
  {
    title: "Cotisation annuelle",
    date: "Toute l'année",
    desc: "Soutenez les charges de fonctionnement de la mosquée par votre cotisation.",
    href: LINKS.cotisation,
    cta: "Contribuer",
  },
];

// --- Disciplines enseignées (bandeau défilant du hero) ---
export const DISCIPLINES = [
  "Arabe",
  "Coran",
  "Tajwid",
  "Éducation islamique",
  "Sciences religieuses",
  "Aqida",
  "Fiqh",
  "Sîra",
];

export const PRAYER_LABELS: Record<string, string> = {
  Fajr: "Fajr",
  Sunrise: "Chourouk",
  Dhuhr: "Dhuhr",
  Asr: "Asr",
  Maghrib: "Maghrib",
  Isha: "Isha",
};
