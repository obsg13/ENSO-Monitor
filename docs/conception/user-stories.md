# User stories — ENSO Monitor

Acteurs : **Visiteur** (consulte les données), **Administrateur** (lance l'import NOAA en ligne de commande).

## US1 — Consulter la courbe de l'indice ONI

En tant que visiteur, je veux voir l'évolution de l'indice ONI sous forme de courbe,
afin de repérer visuellement les épisodes El Niño et La Niña.

Critères d'acceptation :
- La courbe affiche les valeurs ONI enregistrées en base, dans l'ordre chronologique.
- L'unité (°C) et la source (NOAA CPC, ONI v6, ERSSTv6, date d'extraction) sont visibles.
- Les seuils de +0,5 °C et -0,5 °C sont représentés sur le graphique.
- Un indicateur de chargement s'affiche pendant la récupération des données.
- Si l'API ne répond pas, un message d'erreur clair remplace la courbe.

## US2 — Filtrer la courbe par période

En tant que visiteur, je veux choisir une date de début et une date de fin,
afin d'observer l'indice sur une période précise.

Critères d'acceptation :
- Seules les valeurs comprises entre la date de début et la date de fin sont affichées.
- Si la date de début est postérieure à la date de fin, un message d'erreur s'affiche et la courbe n'est pas modifiée.
- Si aucune valeur n'existe sur la période, un message « Aucune donnée sur cette période » s'affiche.
- Le filtre est entièrement utilisable au clavier.

## US3 — Comparer deux épisodes historiques

En tant que visiteur, je veux comparer deux épisodes passés,
afin de comprendre en quoi ils se ressemblent ou diffèrent.

Critères d'acceptation :
- Je peux choisir deux périodes à comparer.
- Pour chaque période, l'application affiche la durée (en saisons), le pic, la saison du pic et la valeur moyenne.
- Un texte d'interprétation décrit les différences en restant prudent (pas de prévision, pas de classe « Super El Niño »).
- Un encadré rappelle les limites : indice unique, valeurs récentes révisables, seuils de ±0,5 °C.

## US4 — Consulter les valeurs sous forme de tableau

En tant que visiteur utilisant un lecteur d'écran, je veux accéder aux valeurs sous forme de tableau,
afin de lire les données sans dépendre du graphique.

Critères d'acceptation :
- Le tableau contient les mêmes valeurs que la courbe (saison, date, valeur en °C).
- Le tableau suit le filtre de période.
- Le tableau utilise des en-têtes de colonnes lisibles par un lecteur d'écran.

## US5 — Utiliser l'application sur mobile et au clavier

En tant que visiteur, je veux utiliser l'application sur mobile comme sur ordinateur, à la souris ou au clavier,
afin d'accéder aux données quel que soit mon équipement.

Critères d'acceptation :
- Sur un écran de 375 px de large, toutes les zones sont lisibles sans défilement horizontal.
- Chaque contrôle (champs, boutons, listes) est accessible avec la touche Tab et l'élément actif est visible.
- Les contrastes texte/fond respectent le niveau AA des recommandations WCAG.

## US6 — Importer les données NOAA sans doublon

En tant qu'administrateur, je veux lancer l'import de l'indice ONI depuis la NOAA,
afin de disposer de données à jour, traçables et sans doublon.

Critères d'acceptation :
- Une copie brute datée de la page NOAA est enregistrée avec son empreinte SHA-256.
- Une même saison n'est jamais enregistrée deux fois pour le même indice.
- Une valeur révisée par la NOAA est mise à jour, pas dupliquée.
- Chaque import est tracé : date, nombre de lignes lues, insérées, mises à jour, ignorées, et statut.
- Relancer l'import sans changement côté NOAA n'insère aucune nouvelle ligne.

## US7 — Voir les épisodes détectés automatiquement (extension)

En tant que visiteur, je veux voir la liste des épisodes El Niño et La Niña détectés,
afin de choisir facilement des épisodes à comparer.

Critères d'acceptation :
- Un épisode est détecté quand l'ONI reste ≥ +0,5 °C (El Niño) ou ≤ -0,5 °C (La Niña) pendant au moins 5 saisons consécutives.
- La règle (indice, seuil, durée) est affichée à côté de la liste.
- Un épisode en cours est signalé comme non terminé.
