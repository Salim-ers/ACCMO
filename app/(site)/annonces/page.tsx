import type { Metadata } from "next";
import { getPublished } from "@/lib/announcements";
import { ROUTES } from "@/lib/site";
import { PhotoHeader } from "@/components/PageHeader";
import EventsAgenda from "@/components/EventsAgenda";

export const metadata: Metadata = {
  title: "Annonces et événements",
  description:
    "Annonces, rendez-vous, inscriptions et actions solidaires de la Grande Mosquée de Creil — Essalam (ACCMO).",
  alternates: { canonical: ROUTES.annonces },
};

export default async function AnnoncesPage() {
  const announcements = await getPublished();
  const featured = announcements.find((a) => a.featured) ?? announcements[0];

  return (
    <main id="contenu">
      <PhotoHeader
        crumb="Vie de la mosquée"
        kicker="Agenda"
        photo="interieur"
        title="Ce qui se passe à Essalam"
        intro="Les informations publiées par l’association, les rendez-vous à venir et les démarches ouvertes toute l’année."
      />

      <section className="section" aria-labelledby="h-agenda-page">
        <div className="shell">
          <h2 id="h-agenda-page" className="sr-only">
            Annonces et rendez-vous
          </h2>
          <EventsAgenda items={announcements} featuredId={featured?.id} />
        </div>
      </section>
    </main>
  );
}
