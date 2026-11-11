# Vérifications UX et accessibilité

## Contrastes (WCAG 2.1, niveau AA : 4,5:1 minimum)

| Élément | Couleurs | Rapport |
|---------|----------|---------|
| Texte principal | #1a1a1a sur #ffffff | 17,4:1 |
| Texte secondaire | #4a4a4a sur #ffffff | 8,9:1 |
| Liens et boutons | #0b5cad / blanc sur #0b5cad | 6,7:1 |
| Messages d'erreur | #b00020 sur #ffffff | 7,3:1 |
| Textes des seuils de la courbe | #4a4a4a sur #ffffff | 8,9:1 |

Anomalie détectée et corrigée : Recharts affichait les textes des seuils en #808080 (3,9:1, non conforme). Leur couleur a été fixée à #4a4a4a.

## Responsive

Vérifié sur 375 px de large (iPhone SE, outils de développement de Chrome) : aucun défilement horizontal, champs empilés, courbe pleine largeur, tableaux lisibles.
Anomalie détectée et corrigée : en passant d'une largeur desktop à une largeur mobile sans recharger la page, la courbe gardait sa largeur précédente et débordait ; le navigateur élargissait alors la page, laissant une bande blanche. Le conteneur de la courbe interdit désormais le débordement (`overflow: hidden`), ce qui permet au graphique de se redimensionner.

## Navigation au clavier

Toutes les actions (filtrer, ouvrir le tableau, comparer) sont réalisables au clavier. L'élément actif est signalé par un contour visible (:focus-visible), et l'ordre de tabulation suit l'ordre de la page.

## Graphique accessible

- Seuils signalés par un texte, pas seulement par une couleur.
- Légende « ONI (°C) » et unité affichée sur l'axe vertical.
- Description du graphique dans un `figcaption`.
- Tableau alternatif contenant les mêmes valeurs, avec en-têtes de colonnes pour les lecteurs d'écran.
- Messages de chargement et d'erreur annoncés aux lecteurs d'écran (`aria-live`, `role="alert"`).

## Audit automatique

Lighthouse (Chrome), catégorie Accessibilité : score 100/100 (capture : `docs/screenshots/lighthouse-accessibility.png`).
