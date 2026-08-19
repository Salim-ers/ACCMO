import { FULL_ADDRESS, LINKS, LOGO, ROUTES, SITE } from "@/lib/site";
import { getPrayerDay } from "@/lib/prayer";
import { getSettings } from "@/lib/settings";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MobileQuickBar from "@/components/MobileQuickBar";
import SiteLoader from "@/components/SiteLoader";

// Habillage public commun à toutes les pages du site.
// Les horaires sont lus une seule fois par rendu puis partagés par l'en-tête,
// le pied de page et les sections : une seule requête vers Mawaqit.

// Les annonces et les horaires évoluent : on régénère au maximum toutes
// les 60 s plutôt que de rendre chaque visite dynamique.
export const revalidate = 60;

// Données structurées : lieu de culte + association gestionnaire.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Mosque",
      "@id": `${SITE.url}#mosque`,
      name: SITE.name,
      alternateName: SITE.shortName,
      url: SITE.url,
      description: SITE.description,
      image: `${SITE.url}/photos/mosquee-facade.jpg`,
      logo: LOGO,
      email: SITE.email,
      ...(SITE.phone ? { telephone: SITE.phone } : {}),
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.city,
        postalCode: SITE.address.zip,
        addressCountry: "FR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: SITE.geo.lat,
        longitude: SITE.geo.lng,
      },
      hasMap: `${SITE.url}${ROUTES.contact}`,
      sameAs: [SITE.social.facebook, SITE.social.instagram, LINKS.mawaqit],
      parentOrganization: { "@id": `${SITE.url}#association` },
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Espace femmes", value: true },
        { "@type": "LocationFeatureSpecification", name: "Salle d'ablutions", value: true },
        { "@type": "LocationFeatureSpecification", name: "Accès PMR", value: true },
        { "@type": "LocationFeatureSpecification", name: "Stationnement", value: true },
      ],
    },
    {
      "@type": ["NGO", "Organization"],
      "@id": `${SITE.url}#association`,
      name: SITE.legalName,
      alternateName: SITE.association,
      url: SITE.url,
      email: SITE.email,
      ...(SITE.phone ? { telephone: SITE.phone } : {}),
      taxID: SITE.legal.siret,
      vatID: SITE.legal.tva,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.city,
        postalCode: SITE.address.zip,
        addressCountry: "FR",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}#website`,
      url: SITE.url,
      name: SITE.name,
      inLanguage: "fr-FR",
      publisher: { "@id": `${SITE.url}#association` },
      description: `${SITE.description} ${FULL_ADDRESS}.`,
    },
  ],
};

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prayerDay, settings] = await Promise.all([getPrayerDay(), getSettings()]);

  return (
    <div className="pb-[58px] sm:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteLoader />
      <SiteHeader prayerDay={prayerDay} />
      {children}
      <SiteFooter prayerDay={prayerDay} aidEnabled={settings.aidEnabled} />
      <MobileQuickBar />
    </div>
  );
}
