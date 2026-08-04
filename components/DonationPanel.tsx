import { LINKS } from "@/lib/site";
import { Icon } from "@/components/Icons";

// Soutien — composition horizontale : le pourquoi à gauche, le comment à
// droite. Transparent sur ce qui est certain (paiement Stripe, montant libre)
// et muet sur ce qui ne l'est pas : aucun montant suggéré, aucune promesse
// fiscale, aucun objectif chiffré.

const USES = [
  {
    title: "Le fonctionnement",
    desc: "Électricité, chauffage, eau, assurances : la mosquée doit rester ouverte tous les jours.",
  },
  {
    title: "L’entretien du lieu",
    desc: "Nettoyage, réparations et aménagement des espaces d’accueil et de prière.",
  },
  {
    title: "L’enseignement",
    desc: "Matériel, salles et organisation des cours pour les enfants et les adultes.",
  },
  {
    title: "La solidarité",
    desc: "Collectes et aides aux familles accompagnées par l’association.",
  },
];

const WAYS = [
  {
    label: "Don ponctuel",
    desc: "Une contribution unique, du montant de votre choix.",
    href: LINKS.don,
    primary: true,
  },
  {
    label: "Cotisation annuelle",
    desc: "La contribution des adhérents de l’association ACCMO.",
    href: LINKS.cotisation,
  },
  {
    label: "Montant libre",
    desc: "Le montant se saisit directement sur la page de paiement sécurisée.",
    href: LINKS.don,
  },
];

export default function DonationPanel() {
  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[52fr_48fr] lg:gap-16">
      {/* ---- Pourquoi ---- */}
      <div data-reveal>
        <h2 className="title-lg text-night-900">
          Faire vivre Essalam,
          <br />
          ensemble.
        </h2>
        <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-night-600">
          La mosquée ne fonctionne que grâce aux contributions de celles et ceux qui la
          fréquentent. Chaque don couvre des dépenses réelles, listées ci-dessous.
        </p>

        <dl className="mt-8 border-t border-[var(--rule-strong)]">
          {USES.map((u) => (
            <div key={u.title} className="border-b border-[var(--rule)] py-4">
              <dt className="text-[15px] font-bold text-night-900">{u.title}</dt>
              <dd className="mt-1 text-[14.5px] leading-relaxed text-night-600">{u.desc}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ---- Comment ---- */}
      <div data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-night-500">
          Choisir sa contribution
        </p>

        <ul className="mt-5">
          {WAYS.map((w) => (
            <li key={w.label}>
              <a
                href={w.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between gap-5 p-5 transition-colors ${
                  w.primary
                    ? "bg-night-900 text-sand-50 hover:bg-terra-600"
                    : "border-b border-[var(--rule)] bg-white text-night-900 hover:bg-sand-100"
                } ${w.primary ? "" : "border-x border-[var(--rule)]"}`}
              >
                <span className="min-w-0">
                  <span className="block text-[18px] font-extrabold tracking-tight">
                    {w.label}
                  </span>
                  <span
                    className={`mt-1 block text-[13.5px] leading-relaxed ${
                      w.primary ? "text-night-200 group-hover:text-white" : "text-night-600"
                    }`}
                  >
                    {w.desc}
                  </span>
                </span>
                <Icon.arrowUpRight
                  width={19}
                  height={19}
                  className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-start gap-3 bg-sand-200 p-5">
          <Icon.info width={18} height={18} className="mt-0.5 shrink-0 text-night-700" />
          <p className="text-[13.5px] leading-relaxed text-night-700">
            Le paiement est traité par <strong>Stripe</strong> : vos coordonnées bancaires
            ne transitent jamais par ce site. Le montant et la fréquence se choisissent sur
            la page de paiement. Vous pouvez également remettre votre contribution
            directement à la mosquée.
          </p>
        </div>
      </div>
    </div>
  );
}
