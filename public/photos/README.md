# Photographies de la mosquée

Les photos utilisées par le site sont déclarées **une seule fois**, dans
`lib/site.ts` (objet `PHOTOS`). Les composants s'y réfèrent par leur clé :
si tu changes un fichier ici, mets à jour ce seul objet.

| Clé         | Fichier attendu           | Où elle apparaît                                                        |
| ----------- | ------------------------- | ----------------------------------------------------------------------- |
| `facade`    | `mosquee-facade.jpg`      | Hero (photo verticale), en-têtes photographiques, image Open Graph        |

> **Remplacer la photo du hero** : écrase simplement `mosquee-facade.jpg`
> (même nom, même extension `.jpg`) — aucune modification de code n'est
> nécessaire, les trois emplacements ci-dessus suivent. La photo est un
> cliché 4:3 recadré en vertical dans le hero : le point focal est réglé
> par `object-[72%_center]` dans `components/HomeHero.tsx`, à ajuster si
> le sujet principal n'est plus sur la droite du cadre.
| `salle`     | `mosquee-salle.jpg`       | Vignette carrée du hero, aperçu de la visite 360°, raccourci « Visiter »  |
| `interieur` | `mosquee-interieur.png`   | Section école, en-tête de la page Annonces, raccourci « École Al Ghazali » |

## Règles de traitement

- **Cadrage architectural** : les photos sont recadrées par `object-fit: cover`
  et un point focal explicite (`object-position`), jamais déformées.
- **Formats et poids** : viser ≥ 1600 px de large et < 400 Ko. Compresse au
  besoin (par exemple sur https://squoosh.app).
- **Textes alternatifs** : ils sont écrits dans `PHOTOS[...].alt` et décrivent
  la photo réelle. Une photo purement décorative reçoit `alt=""`.
- **Chargement** : seule la photo du hero est prioritaire ; les autres sont
  chargées en différé par `next/image`.
- Les photos sont servies localement (`/photos/...`), donc rapides et conformes
  à la politique de sécurité (CSP) du site.

## Ajouter une photo

1. Dépose le fichier dans ce dossier.
2. Ajoute une entrée dans `PHOTOS` (`lib/site.ts`) avec un `alt` précis.
3. Référence-la par sa clé dans le composant voulu.

`mosaique-zellige.png` n'est plus utilisé : la trame géométrique du site est
désormais construite en CSS (`.mesh-faint`), à très faible opacité.
