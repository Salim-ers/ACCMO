# Grande Mosquée de Creil — Essalam (ACCMO)

Site de la Grande Mosquée de Creil : **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.
Aucune librairie d'animation, aucune dépendance 3D — tout est en CSS et en composants serveur.

Identité : **« Le centre vivant de la communauté »** — bleu nuit minéral, sable lumineux,
accent terre cuite, grille éditoriale à filets fins. Voir §3.

---

## 1. Prérequis

- **Node.js ≥ 18.18** (recommandé : Node 20 ou 22)
- npm (fourni avec Node)

## 2. Installation & lancement

```bash
npm install

# Créer le fichier d'environnement
cp .env.example .env.local
#   puis ÉDITER .env.local :
#   - ADMIN_PASSWORD  (mot de passe de l'espace admin)
#   - SESSION_SECRET  (chaîne aléatoire ≥ 32 caractères — openssl rand -hex 32)

npm run dev            # http://localhost:3000
npm run build && npm run start
```

> ℹ️ Le premier build télécharge les polices (**Plus Jakarta Sans**, **Noto Kufi Arabic**)
> via `next/font/google` : une connexion internet est nécessaire au build. Elles sont
> ensuite auto-hébergées.

---

## 3. Design system

Les jetons sont définis deux fois, volontairement, et doivent rester synchronisés :
`app/globals.css` (variables CSS, pour les composants sur mesure) et
`tailwind.config.ts` (échelles de couleurs, pour les classes utilitaires).

| Rôle                | Valeur    | Usage                                              |
| ------------------- | --------- | -------------------------------------------------- |
| Bleu nuit (`night-900`) | `#101b2d` | Identité principale, fonds sombres, texte fort   |
| Bleu minéral (`night-600`) | `#294865` | Texte secondaire, filets                     |
| Bleu brumeux (`night-100`) | `#dceaf0` | Fonds de sections claires                    |
| Terre cuite (`terra-500`)  | `#c66f4e` | **Marqueurs et filets uniquement**           |
| Terre cuite foncée (`terra-600`) | `#a85940` | **Dès qu'il y a du texte** (AA garanti) |
| Sable (`sand-200`)  | `#f1e7d6` | Blocs d'appel, fonds chaleureux                     |
| Blanc cassé         | `#faf8f3` | Surface générale du site                            |

**Règle de contraste** : la terre cuite claire (`#c66f4e`) ne porte jamais de texte —
le blanc dessus ne donne que 3,6:1. Tout panneau terracotta porteur de texte utilise
`terra-600` (blanc dessus = 5:1). Idem pour les petits textes terracotta sur fond clair.

Autres principes :

- Angles courts (4 / 10 / 18 px), **jamais de capsule**, jamais d'ombre floue.
- Filets 1 px (`--rule`) comme séparateur signature, plutôt que des cartes ombrées.
- Titres expressifs par la **taille et la graisse** (`.title-xl/lg/md`), jamais par
  un espacement artificiel des lettres.
- Motif géométrique en CSS (`.mesh-faint`), à opacité très faible.
- L'arabe (`.arabic`) est lisible et aligné, jamais décoratif.

## 4. Horaires de prière

Les horaires viennent du **calendrier officiel de la mosquée sur Mawaqit**
(`https://mawaqit.net/fr/m/essalam-creil`). `lib/prayer.ts` lit l'objet `confData`
de cette page **côté serveur** (cache 1 h) et en extrait le calendrier annuel, les
délais d'iqama et l'heure de la Jumu'a. Aucune iframe n'est incrustée.

- `getPrayerDay()` est appelé **une fois par rendu**, dans `app/(site)/layout.tsx`,
  puis passé en props à l'en-tête, au pied de page et aux sections.
- `serverMinutes` transporte l'heure de Paris du rendu serveur : le HTML initial
  affiche déjà la bonne prochaine prière, sans écart d'hydratation.
- `lib/usePrayerClock.ts` prend le relais côté client (tic de 20 s, fuseau
  Europe/Paris quel que soit celui du visiteur) et recharge le calendrier via
  `/api/prayer-times` au passage de minuit.
- **Si la source est injoignable, aucun horaire n'est inventé** : l'interface
  affiche un message explicite et renvoie vers Mawaqit.

## 5. Gérer les annonces (espace admin)

1. Aller sur **`/admin`** (lien discret en bas de page).
2. Se connecter avec le mot de passe défini dans `ADMIN_PASSWORD`.
3. Ajouter / modifier / supprimer une annonce, avec :
   titre, contenu, date, **rubrique** (Informations pratiques, Enseignement,
   Événements, Solidarité), photo, lien, « à la une », publication.

La rubrique alimente les **filtres de l'agenda** côté public. Les annonces créées
avant l'ajout des rubriques reçoivent « Informations pratiques » automatiquement.

Stockage : **Vercel KV / Upstash** en production, sinon `data/announcements.json`
en local. Même interface dans les deux cas.

`lib/kv-env.ts` résout les identifiants du store en acceptant **n'importe quel
préfixe** appliqué par l'intégration Vercel (`KV_REST_API_URL`,
`UPSTASH_REDIS_REST_URL`, `STORAGE_KV_REST_API_URL`…), à condition que l'URL et
le jeton partagent le même préfixe. Les noms standards restent prioritaires, et
un jeton en lecture seule n'est jamais retenu.

L'espace `/admin` **teste réellement le store** au chargement et affiche un
bandeau si la base ne répond pas, en nommant l'hôte fautif — plutôt que de
laisser découvrir la panne au moment d'un enregistrement perdu. Sur le plan
gratuit Upstash, une base inutilisée est *archivée* et son point d'accès retiré :
elle se restaure depuis la console Upstash, données comprises.

## 6. Où modifier le contenu

| Élément                                                                | Fichier                    |
| ---------------------------------------------------------------------- | -------------------------- |
| Adresse, contact, liens externes, navigation, raccourcis, chapitres, actions, pied de page | `lib/site.ts`  |
| Photographies et leurs textes alternatifs                              | `lib/site.ts` (`PHOTOS`) + `public/photos/` |
| Rubriques de l'agenda                                                  | `lib/categories.ts`        |
| Annonces                                                               | `/admin`                   |
| Couleurs, typographie, animations                                      | `tailwind.config.ts` + `app/globals.css` |
| En-têtes de sécurité (CSP…)                                            | `next.config.mjs`          |

**Aucune donnée inventée.** Les informations non confirmées par l'association sont
`null` dans `lib/site.ts` (`SITE.phone`, `ACCESS.transport`, `ACCESS.doorsOpening`)
et **rien ne s'affiche** tant qu'elles ne sont pas renseignées. Les mentions légales
signalent explicitement « À compléter par l'association » pour le directeur de
publication et le numéro RNA / SIRET.

Tous les liens de l'ancien site sont préservés : don/cotisation Stripe, commande de
mouton (kebchi), inscription Madrassah, visite virtuelle 360°, école Al Ghazali,
Facebook, Instagram, Mawaqit.

## 7. Structure du projet

```
app/
  layout.tsx              Polices, métadonnées globales, drapeau « js »
  globals.css             Jetons, boutons, filets, motif, révélations
  (site)/                 Groupe de routes du site public
    layout.tsx            En-tête + pied de page + JSON-LD + horaires partagés
    page.tsx              Accueil (hero, horaires, raccourcis, agenda, école,
                          360°, histoire, actions, don, localisation)
    horaires/ annonces/ la-mosquee/ ecole/ visite-virtuelle/
    contact/ soutenir/ mentions-legales/ confidentialite/
  admin/                  Espace admin (hors habillage public)
  api/                    Auth, CRUD annonces, réglages, upload, horaires
  not-found.tsx  sitemap.ts  robots.ts
components/
  SiteHeader  PrayerStatusBar  PrayerTimeline  NextPrayerCard  HomeHero
  CommunityShortcuts  EventsAgenda  SchoolFeature  VirtualTourSection
  HeritageChapters  CommunityActions  DonationPanel  LocationSection
  SiteFooter  FooterPrayerLine  MobileQuickBar  PageHeader  SectionHead
  RevealEngine  Icons  AdminDashboard
lib/
  site.ts (configuration centrale)  prayer.ts (Mawaqit)  usePrayerClock.ts
  categories.ts  format.ts  announcements.ts  settings.ts  auth.ts
```

## 8. Pages intérieures

Quatre types d'en-têtes (`components/PageHeader.tsx`) pour qu'aucune page ne
ressemble au même gabarit avec un titre différent :

- `EditorialHeader` — pages de fond (La mosquée, École) ;
- `FunctionalHeader` — pages outils, fond bleu nuit (Horaires, Contact, Soutenir, 360°) ;
- `CompactHeader` — pages légales ;
- `PhotoHeader` — usage ponctuel, bandeau photographique (Annonces).

## 9. Sécurité

- Espace admin protégé par mot de passe (`ADMIN_PASSWORD`), comparaison à **temps constant**.
- Session = **cookie httpOnly signé HMAC** (`SESSION_SECRET`), `Secure` en production,
  `SameSite=Lax`, expiration 8 h.
- Toutes les routes de mutation (`POST`/`PUT`/`DELETE`) vérifient l'authentification.
- Entrées **validées et nettoyées** côté serveur (longueurs, format de date, URL, rubrique).
- **En-têtes HTTP durcis** dans `next.config.mjs` : CSP, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS.
- `/admin` et `/api` exclus de l'indexation (`robots.ts` + `noindex`).

> ⚠️ Changez impérativement `ADMIN_PASSWORD` et `SESSION_SECRET` avant la mise en ligne.

## 10. SEO

- Titre et description **uniques par page**, canonical, OpenGraph et Twitter Card.
- **JSON-LD** : `Mosque` (adresse réelle, géolocalisation, équipements) +
  `NGO/Organization` (ACCMO) + `WebSite`, liés entre eux par `@id`.
- `sitemap.xml` (dix pages, priorités et fréquences) et `robots.txt` générés.
- Hiérarchie `h1 → h2 → h3` vérifiée sur chaque page, un seul `h1` par page.
- Ancres de l'ancienne page unique conservées (`#horaires`, `#annonces`, `#contact`,
  `#dons`, `#visite-virtuelle`, `#apropos`) : les liens déjà partagés fonctionnent.

## 11. Accessibilité

- Lien d'évitement « Aller au contenu principal ».
- Menu mobile plein écran : `aria-expanded`, fermeture à **Échap**, **piège au clavier
  maîtrisé** (Tab cyclique), focus rendu au bouton à la fermeture.
- Focus visible franc (contour terre cuite, contour brumeux sur fond sombre).
- Cibles tactiles ≥ 44 px, barre d'accès rapide mobile à 58 px avec libellés visibles.
- Contrastes ≥ 4,5:1 pour le texte courant (voir §3).
- **`prefers-reduced-motion`** respecté : révélations, compte à rebours clignotant et
  déplacement de la visite 360° sont neutralisés.
- **Sans JavaScript, tout le contenu reste visible** : l'état masqué des révélations
  est conditionné à la classe `.js` posée par un script en ligne.

## 12. Performance

- Composants **serveur par défaut** ; îlots clients réduits à l'horloge des prières,
  aux filtres de l'agenda, au menu et à la visite 360°.
- Zéro librairie d'animation (GSAP, Framer Motion et Three.js ont été retirés) :
  environ **87 kB de JS partagé**, 111 kB sur l'accueil.
- Un seul appel à Mawaqit par rendu, mis en cache 1 h ; pages régénérées toutes les 60 s.
- Visite 360° et carte chargées **à la demande** ; photo du hero prioritaire, le reste différé.
- Aucune police décorative : deux familles, `display: swap`, auto-hébergées.
