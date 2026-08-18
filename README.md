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

### Où sont stockées les données

`lib/store.ts` expose `readJson` / `writeJson` et choisit le support **par la
configuration**, jamais par l'état du réseau — un incident passager ne doit pas
déplacer silencieusement les données. Ordre de priorité :

| Rang | Support | Condition | Remarques |
| ---- | ------- | --------- | --------- |
| 1 | **Redis** (Vercel KV / Upstash) | `KV_REST_API_URL` + `KV_REST_API_TOKEN` | Écriture immédiate, données privées. Le plan gratuit Upstash **archive** une base inutilisée. |
| 2 | **Vercel Blob** | `BLOB_STORE_ID` (+ OIDC) ou `BLOB_READ_WRITE_TOKEN` | Ne s'archive pas. Nom de fichier dérivé de `SESSION_SECRET` par HMAC. Propagation publique ≤ 1 min. |
| 3 | **Fichier** `data/*.json` | aucune | Développement seulement : ne persiste pas sur Vercel. |

`lib/kv-env.ts` accepte **n'importe quel préfixe** appliqué par l'intégration
Vercel (`STORAGE_KV_REST_API_URL`…), à condition que l'URL et le jeton partagent
le même. Un jeton en lecture seule n'est jamais retenu.

**Authentification du Blob** — deux modes, gérés tous les deux :

- **Identité du déploiement (OIDC)** : l'intégration Vercel actuelle ajoute
  `BLOB_STORE_ID` et injecte `VERCEL_OIDC_TOKEN` à l'exécution. Aucun jeton à
  recopier ; il suffit de relier le store au projet. C'est le mode en place.
- **Jeton d'écriture** `BLOB_READ_WRITE_TOKEN` : l'ancien modèle, toujours
  accepté. Quand il est présent, il est prioritaire.

`@vercel/blob` doit être en **v2 ou plus** pour l'OIDC : la v0.27 ne connaissait
que le jeton. Cette montée de version apporte trois ruptures qui sont traitées —
`allowOverwrite` passe par défaut à `false` (une réécriture au même chemin lèverait
sans lui), `addRandomSuffix` passe à `false`, et `cacheControlMaxAge` ne peut plus
descendre sous 60 s.

**Sur le support Blob**, deux points de conception méritent d'être connus :

- Vercel Blob ne propose que des objets `public`. Le chemin du fichier est donc
  un HMAC de `SESSION_SECRET`, ce qui le rend indevinable — c'est ce qui protège
  les **brouillons** non publiés. Changer `SESSION_SECRET` rendrait les données
  existantes introuvables.
- Le contenu est servi par un CDN. L'écriture pose `cacheControlMaxAge: 0` et la
  lecture ajoute un paramètre jetable, mais une propagation de quelques minutes
  reste possible côté public. C'est pourquoi **les mutations renvoient la liste
  complète à jour** : l'administration l'affiche directement, sans relecture, et
  ne montre donc jamais un état périmé.

L'espace `/admin` **teste réellement le stockage** au chargement : il affiche le
support actif en permanence, et un bandeau d'alerte nommant la cause dès qu'un
enregistrement devient impossible — plutôt que de laisser découvrir la panne au
moment d'un enregistrement perdu.

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

## 13. Vérification mobile et tablette

```bash
npm run build && npm run start      # dans un terminal
npm run audit:mobile                # dans un autre
```

Le script pilote Chrome et parcourt les onze pages sur **treize formats**, du
Galaxy Fold fermé (280 px) à l'ordinateur, en passant par le mode paysage à
faible hauteur et les tablettes. Il vérifie aussi le **texte agrandi à 200 %**,
exigence WCAG et usage courant chez les personnes âgées.

Il signale :

- le **contenu recouvert** par une surcouche — c'est ce contrôle qui a révélé
  qu'un menu mobile fermé masquait tout le site sous 1024 px ;
- tout **débordement horizontal**, en nommant l'élément fautif ;
- un **texte plus large que son bloc** (mot long, étiquette qui ne se replie pas) ;
- les **cibles tactiles** sous 24 px, hors liens en plein texte (exemptés par
  WCAG 2.2) et hors lien d'évitement, visible au focus seulement ;
- tout **texte sous 11 px** ;
- le **contenu rogné** par un parent — une image en `object-fit: cover` étant
  volontairement plus grande que son cadre, elle est ignorée ;
- le **menu plein écran** : ouverture, défilement quand il ne tient pas à
  l'écran, fermeture par Échap ;
- les **erreurs de console** et les requêtes en échec.

### Trois pièges à ne pas réintroduire

**Les règles de composants restent dans `@layer components`.** Hors couche,
elles sont injectées après les utilitaires Tailwind et l'emportent à égalité de
spécificité : `.btn { display: inline-flex }` écrasait `.hidden`, et les boutons
réservés au grand écran débordaient la page sur mobile.

**Une grille définit toujours sa piste de base.** Sans `grid-cols-1`, la piste
implicite vaut `auto`, dont le plancher est le *min-content* : un seul texte en
`truncate` (donc `nowrap`) élargissait toute la grille au-delà de l'écran.
`grid-cols-1` vaut `minmax(0,1fr)` chez Tailwind et supprime ce plancher.

**Un panneau se masque par une CLASSE, pas par l'attribut `hidden`.** Une classe
utilitaire `flex` l'emporte sur `[hidden]` à égalité de spécificité.

**Les unités `rem` doublent quand le visiteur agrandit le texte, pas les `px`.**
Une largeur fixe en `rem` (`w-44`) ou une étiquette en `inline-flex` — dont le
texte ne descend pas sous son min-content — débordent alors leur conteneur.

## 14. Mot de passe de l'administration

Deux sources, dans cet ordre :

1. le mot de passe **défini depuis `/admin`**, stocké **haché** (scrypt + sel
   aléatoire, jamais en clair) dans le même support que les annonces ;
2. à défaut, la variable `ADMIN_PASSWORD`.

Dès qu'un mot de passe a été défini depuis l'interface, `ADMIN_PASSWORD` est
ignoré. Le changement exige de connaître le mot de passe actuel, refuse les
mots de passe de moins de 10 caractères et les plus courants.

**Le jeton de session porte une empreinte du mot de passe en vigueur.** Changer
le mot de passe invalide donc immédiatement toutes les sessions ouvertes — y
compris un cookie qui aurait été copié ailleurs. Sans cela, effacer le cookie ne
protégerait que le navigateur qui accepte de l'effacer.

**Oubli du mot de passe** : poser `ADMIN_PASSWORD_RESET=1` dans Vercel neutralise
le mot de passe enregistré et rend la main à `ADMIN_PASSWORD`, le temps d'en
définir un nouveau depuis l'interface. **Retirer la variable ensuite** — tant
qu'elle est là, l'ancien mot de passe d'environnement reste valable.
