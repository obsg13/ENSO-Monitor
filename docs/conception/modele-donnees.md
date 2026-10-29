# Modèle de données — ENSO Monitor

Diagramme : `docs/diagrams/class-diagram.drawio.svg`

## Entités

- **Source** : organisme qui publie les données (NOAA CPC) et adresse de la page d'origine.
- **ClimateIndex** : série climatique suivie (ONI), avec son unité et la version du jeu de données (ERSSTv6).
- **ImportRun** : une exécution de l'ETL ; conserve la date d'extraction, la copie brute, son empreinte SHA-256 et le bilan de l'import.
- **Observation** : une valeur de l'indice pour une saison, datée par le mois central de la saison.

## Cardinalités

| Relation | Cardinalité | Justification |
|----------|-------------|---------------|
| Source — ClimateIndex | 1 — 0..* | Une source peut publier plusieurs indices (ONI, RONI) ; ajouter un indice ne demande qu'une ligne, sans changer la structure. |
| ClimateIndex — ImportRun | 1 — 0..* | L'import est relancé à chaque mise à jour NOAA ; chaque exécution concerne un seul indice. |
| ClimateIndex — Observation | 1 — 0..* | Une valeur n'a de sens que rattachée à son indice. |
| ImportRun — Observation | 1 — 0..* | Chaque valeur est rattachée à l'import qui l'a écrite ou révisée en dernier : c'est la traçabilité. Un import sans changement n'écrit aucune valeur. |

## Contraintes

- **Unicité (indice, date)** : un indice ne peut avoir qu'une valeur par saison ; la base refuse les doublons.
- **Plage de valeurs (-5 à +5 °C)** : écarte les valeurs aberrantes issues d'une erreur de lecture.
- **Pas d'année stockée à part** : elle se déduit de la date, ce qui évite toute incohérence.
