# 1. Besoin et contexte

## Objectif

ENSO Monitor permet d'explorer l'indice ONI (Oceanic Niño Index) publié par la NOAA, afin de visualiser les épisodes El Niño et La Niña depuis 1950 et de comparer deux épisodes historiques. Les données affichées sont réelles, sourcées et vérifiables : chaque valeur est rattachée à l'import qui l'a enregistrée et à une copie brute de la page NOAA.

## Public cible

- Grand public curieux de comprendre les épisodes El Niño et La Niña évoqués dans l'actualité.
- Étudiants et enseignants (géographie, sciences de la Terre) qui ont besoin d'une visualisation simple et sourcée.
- Journalistes souhaitant comparer un épisode en cours à des épisodes passés.

## Contraintes

- Projet individuel réalisé en cinq jours.
- Stack imposée : React / TypeScript / Vite, FastAPI, PostgreSQL / SQLAlchemy / Alembic, ETL Python avec Pandas et NumPy.
- Données scientifiques authentiques : une série NOAA (ONI ou RONI), avec source, version et date d'extraction documentées.
- Interface responsive, utilisable au clavier, avec des graphiques accessibles.
- Aucune dépense : le déploiement est documenté mais non réalisé.

## Périmètre du MVP

1. Import de l'indice ONI v6 dans PostgreSQL, avec identification de la source et contrôle des doublons.
2. API FastAPI documentée, avec filtrage par période et validation des entrées.
3. Courbe interactive avec filtre de période, unité et source visibles, et tableau alternatif.
4. Comparaison de deux épisodes historiques avec une interprétation prudente.

La détection automatique des épisodes est une extension, réalisée seulement si le temps le permet.

## Limites

- **Un seul indice** : l'ONI mesure la température de surface d'une zone du Pacifique (Niño 3.4). Il ne décrit ni la composante atmosphérique d'ENSO ni ses effets régionaux.
- **ONI et RONI** : depuis le communiqué NWS 26-05, la NOAA utilise le RONI pour le suivi officiel. L'ONI reste l'indice de référence des études historiques, objet de cette application.
- **Valeurs récentes provisoires** : la NOAA peut réviser une valeur jusqu'à deux mois après sa publication.
- **Granularité saisonnière** : chaque valeur est une moyenne glissante sur trois mois ; l'application ne descend pas en dessous.
- **Pas de prévision** : l'application décrit des mesures passées et ne prévoit pas les épisodes futurs.
- **Dépendance au format de la page NOAA** : les données sont publiées sous forme de tableau HTML, sans fichier brut ni API ; un changement de mise en page empêcherait l'import, sans affecter les données déjà en base.
