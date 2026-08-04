import { NextResponse } from "next/server";
import { getPrayerDay } from "@/lib/prayer";

// Permet au client de rafraîchir les horaires au passage de minuit sans
// recharger la page (`connect-src 'self'` reste respecté).
//
// La réponse doit être calculée à la demande : une version figée servirait
// la date de génération et non celle du jour. La lecture de Mawaqit reste,
// elle, mise en cache une heure — l'appel est donc peu coûteux.
export const dynamic = "force-dynamic";

export async function GET() {
  const day = await getPrayerDay();
  if (!day) {
    return NextResponse.json(
      { error: "Horaires indisponibles" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
  return NextResponse.json(day, {
    headers: { "Cache-Control": "no-store" },
  });
}
