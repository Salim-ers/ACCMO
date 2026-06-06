# Photos de la mosquée — emplacements de fond

Dépose ici tes photos avec **exactement** ces noms de fichiers.
Elles s'afficheront automatiquement en fond (avec un voile vert
émeraude pour la lisibilité du texte). Tant qu'un fichier est absent,
le motif zellige + le dégradé vert servent de repli : le site reste soigné.

| Fichier                     | Où il apparaît                | Photo conseillée                          |
| --------------------------- | ----------------------------- | ----------------------------------------- |
| `mosquee-exterieur.png`     | Hero (haut de page)           | Façade + minaret (extérieur)              |
| `mosquee-interieur.png`     | Bloc « Visite virtuelle 360° »| Salle de prière (tapis, colonnes, lustre) |
| `mosquee-mihrab.png`        | Bandeau « Faire un don »      | Mihrab / minbar (carrelage zellige)       |
| `mosaique-fond.png`         | Fond mosaïque de tout le site | Carrelage zellige (motif répété)          |

## Conseils

- Formats acceptés : `.jpg`, `.jpeg`, `.png`, `.webp` — mais garde le nom
  `*.jpg` ci-dessus, ou adapte le `--photo` dans le composant correspondant.
- Privilégie des images **larges et lumineuses** (min. 1600 px de large)
  et < 500 Ko (compresse-les sur https://squoosh.app si besoin).
- Les photos sont servies en local (`/photos/...`), donc rapides et
  conformes à la politique de sécurité (CSP) du site.

## Remplacer un nom de fichier

Le nom est défini via la variable CSS `--photo` dans :

- Hero  → `components/Hero.tsx`
- Visite virtuelle → `components/VirtualTour.tsx`
- Don   → `components/Donate.tsx`
