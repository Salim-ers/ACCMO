# Grande Mosquée de Creil — Essalam (ACCMO)

Refonte complète du site : **Next.js 14 (App Router) + TypeScript + Tailwind CSS + GSAP**.
Design moderne, chaleureux et spirituel, responsive mobile-first, accessible, optimisé SEO,
avec un **espace d'administration des annonces** sans toucher au code.

---

## 1. Prérequis

- **Node.js ≥ 18.18** (recommandé : Node 20 ou 22)
- npm (fourni avec Node)

## 2. Installation & lancement

```bash
# 1. Installer les dépendances
npm install

# 2. Créer le fichier d'environnement
cp .env.example .env.local
#   puis ÉDITER .env.local et définir :
#   - ADMIN_PASSWORD  (mot de passe de l'espace admin)
#   - SESSION_SECRET  (chaîne aléatoire ≥ 32 caractères)
#   Générer un secret : openssl rand -hex 32

# 3. Lancer en développement
npm run dev          # http://localhost:3000

# 4. Build de production
npm run build
npm run start        # http://localhost:3000
```

> ℹ️ Le **premier build télécharge les polices** (Fraunces, Plus Jakarta Sans, Amiri)
> via `next/font/google` : une connexion internet est nécessaire au build.

---

## 3. Gérer les annonces (espace admin)

1. Aller sur **`/admin`** (lien aussi en bas de page → « Espace administration »).
2. Se connecter avec le mot de passe défini dans `ADMIN_PASSWORD`.
3. Depuis le tableau de bord, vous pouvez :
   - **Ajouter** une annonce (titre, contenu, date) ;
   - **Modifier** une annonce existante ;
   - **Supprimer** une annonce ;
   - **Choisir une date** (sélecteur de date) ;
   - **Mettre en avant** (« à la une ») ;
   - **Publier / Dépublier** (brouillon non visible du public).

Les annonces sont stockées dans **`data/announcements.json`**. Le site public
n'affiche que les annonces **publiées** ; l'admin voit tout.

---

## 4. Où modifier le contenu

| Élément | Fichier |
| --- | --- |
| Liens (dons, mouton, inscriptions, visite virtuelle), navigation, services, événements | `lib/site.ts` |
| Annonces | via `/admin` (ou `data/announcements.json`) |
| Couleurs & typographie | `tailwind.config.ts` |
| En-têtes de sécurité (CSP…) | `next.config.mjs` |

**Tous les liens existants du site actuel sont préservés** dans `lib/site.ts` :
don/cotisation Stripe, commande de mouton (kebchi), inscription Madrassah,
**visite virtuelle 360°**, Facebook, Instagram.

---

## 5. Mise en production

### Option A — Hébergement Node persistant (recommandé tel quel)
VPS, Render, Railway, Dokku, Docker, OVH… Le stockage des annonces en fichier
JSON fonctionne directement.

```bash
npm run build && npm run start
```

### Option B — Vercel / Netlify (serverless)
Le système de fichiers y est **en lecture seule** : l'écriture d'annonces
échouerait. Basculez le stockage vers une base externe (l'interface admin ne
change pas). La couche d'accès est isolée dans `lib/announcements.ts` :
il suffit d'y remplacer `readAll`/`writeAll` par des appels à **Supabase**,
**Vercel KV**, **Vercel Postgres** ou **Notion**. Exemple Supabase :

```ts
// lib/announcements.ts — remplacer readAll/writeAll
import { createClient } from "@supabase/supabase-js";
const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
// readAll  -> const { data } = await db.from("announcements").select("*");
// create   -> await db.from("announcements").insert(item);
// update   -> await db.from("announcements").update(value).eq("id", id);
// remove   -> await db.from("announcements").delete().eq("id", id);
```

---

## 6. Sécurité

- Espace admin protégé par mot de passe (`ADMIN_PASSWORD`), comparaison à **temps constant**.
- Session = **cookie httpOnly signé HMAC** (`SESSION_SECRET`), `Secure` en production, `SameSite=Lax`, expiration 8 h.
- Toutes les routes de mutation (`POST`/`PUT`/`DELETE`) vérifient l'authentification.
- Entrées **validées et nettoyées** côté serveur (longueurs, format de date).
- **En-têtes HTTP durcis** dans `next.config.mjs` : Content-Security-Policy, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS.
- `/admin` et `/api` exclus de l'indexation (`robots.ts` + `noindex`).

> ⚠️ Changez impérativement `ADMIN_PASSWORD` et `SESSION_SECRET` avant la mise en ligne.

---

## 7. SEO

- Métadonnées complètes (title/description, **OpenGraph**, Twitter Card, canonical).
- **Données structurées JSON-LD** de type `Mosque` (nom, adresse, géolocalisation, réseaux).
- **`sitemap.xml`** et **`robots.txt`** générés automatiquement.
- HTML sémantique (`header`, `main`, `nav`, `section`, `article`, `footer`), `lang="fr"`.
- Polices avec `display: swap`, images optimisées via `next/image`.

## 8. Accessibilité

- Lien d'évitement « Aller au contenu ».
- Navigation clavier complète, focus visible, `aria-*` sur menu/boutons/sections.
- Menu mobile fermable au clavier (Échap) et au clic.
- **`prefers-reduced-motion`** respecté : toutes les animations GSAP/CSS sont désactivées.
- Contrastes conformes (vert profond / sable / texte encre).

## 9. Performance

- Composants serveur par défaut ; client uniquement là où nécessaire (GSAP, formulaires).
- GSAP chargé côté client avec nettoyage automatique (`useGSAP`).
- Iframes (visite virtuelle, carte) en **lazy-load** ; la visite 360° ne se charge qu'au clic.
- Build statique pour les pages publiques.

---

## 10. Structure du projet

```
app/
  layout.tsx          Polices, SEO, JSON-LD
  page.tsx            Page d'accueil (assemblage des sections)
  globals.css         Styles, motifs islamiques, reduced-motion
  sitemap.ts / robots.ts
  admin/              Espace admin (login + tableau de bord)
  api/                Auth + CRUD annonces
components/           Header, Hero, PrayerTimes, Announcements, Services,
                      Events, Donate, VirtualTour, Contact, Footer, Reveal…
lib/                  site.ts (config/liens), announcements.ts, auth.ts
data/announcements.json
```

## 11. Animations GSAP

- **Hero** : timeline d'entrée (arche/mihrab, bismillah, titres, CTA, statistiques) + flottement.
- **Sections** : révélation au scroll avec `ScrollTrigger` (composant `Reveal`, effet *stagger*).
- **Cartes** : apparition échelonnée + micro-interactions au survol.
- **Menu mobile** : ouverture/fermeture animée, liens en cascade.

Toutes les animations sont **coupées** si l'utilisateur a activé « réduire les animations ».
