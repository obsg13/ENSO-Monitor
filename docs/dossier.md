# ENSO Monitor

## Dossier de conception

Plateforme d'analyse des épisodes El Niño et La Niña à partir de l'indice ONI de la NOAA.

Victor Chabeau  
HETIC, Web3, sujet de rattrapage 2026

### Sommaire

1. Besoin et contexte
2. Fonctionnel et UX
3. UML et modélisation
4. Architecture technique
5. Organisation du projet
6. Qualité et sécurité
7. Déploiement proposé
8. Bilan et sources

<div style="page-break-after: always;"></div>

# 1. Besoin et contexte

## Objectif

ENSO Monitor permet d'explorer l'indice ONI (Oceanic Niño Index) publié par la NOAA, de visualiser les épisodes El Niño et La Niña depuis 1950 et de comparer deux épisodes historiques. Les données sont réelles, sourcées et vérifiables : chaque valeur est rattachée à l'import qui l'a enregistrée et à une copie brute de la page NOAA.

## Public cible

- Le grand public, qui entend parler d'El Niño dans l'actualité et veut comprendre de quoi il s'agit.
- Les étudiants et enseignants en géographie ou en sciences de la Terre, qui ont besoin d'une visualisation simple et sourcée.
- Les journalistes, qui veulent comparer un épisode en cours à des épisodes passés.

## Contraintes

- Projet individuel réalisé en cinq jours.
- Stack imposée : React, TypeScript et Vite pour l'interface ; FastAPI pour l'API ; PostgreSQL, SQLAlchemy et Alembic pour les données ; Python, Pandas et NumPy pour l'ETL.
- Une série NOAA authentique (ONI ou RONI), avec sa source, sa version et sa date d'extraction.
- Une interface responsive, utilisable au clavier, avec des graphiques accessibles.
- Aucune dépense : le déploiement est documenté mais pas réalisé.

## Périmètre du MVP

1. Import de l'indice ONI v6 dans PostgreSQL, avec identification de la source et contrôle des doublons.
2. API FastAPI documentée, avec filtrage par période et validation des entrées.
3. Courbe interactive avec filtre de période, unité et source visibles, et un tableau en alternative.
4. Comparaison de deux épisodes historiques avec une interprétation prudente.

La détection automatique des épisodes est une extension, hors du MVP.

## Limites

- **Un seul indice.** L'ONI mesure la température de surface d'une zone du Pacifique (Niño 3.4). Il ne décrit ni la composante atmosphérique d'ENSO ni ses effets régionaux.
- **ONI et RONI.** Depuis le communiqué NWS 26-05, la NOAA utilise le RONI pour le suivi officiel. L'ONI reste l'indice de référence des études historiques, qui sont l'objet de l'application.
- **Valeurs récentes provisoires.** La NOAA peut réviser une valeur jusqu'à deux mois après sa publication.
- **Granularité saisonnière.** Chaque valeur est une moyenne sur trois mois glissants.
- **Pas de prévision.** L'application décrit des mesures passées.
- **Dépendance à la page NOAA.** Les données ne sont publiées que sous forme de tableau HTML, sans fichier brut ni API. Un changement de mise en page bloquerait l'import, sans toucher aux données déjà en base.

<div style="page-break-after: always;"></div>

# 2. Fonctionnel et UX

## User stories et critères d'acceptation

L'application a deux acteurs : le **visiteur**, qui consulte les données, et l'**administrateur**, qui lance l'import NOAA en ligne de commande.

**US1, consulter la courbe ONI.** En tant que visiteur, je veux voir l'évolution de l'ONI sous forme de courbe, afin de repérer les épisodes El Niño et La Niña.
Critères : valeurs dans l'ordre chronologique ; unité, source, version et date d'extraction visibles ; seuils de ±0,5 °C tracés ; message pendant le chargement et en cas d'erreur de l'API.

**US2, filtrer par période.** En tant que visiteur, je veux choisir une date de début et une date de fin, afin d'observer une période précise.
Critères : seules les valeurs de la période sont affichées ; message d'erreur si le début suit la fin, sans modifier la courbe ; message si la période ne contient aucune donnée ; filtre utilisable au clavier.

**US3, comparer deux épisodes.** En tant que visiteur, je veux comparer deux épisodes passés, afin de voir ce qui les rapproche ou les distingue.
Critères : choix de deux périodes ; durée, pic, saison du pic et moyenne pour chacune ; texte d'interprétation prudent, sans prévision ni classe « Super El Niño » ; rappel des limites.

**US4, lire les valeurs en tableau.** En tant que visiteur utilisant un lecteur d'écran, je veux accéder aux valeurs sous forme de tableau, afin de ne pas dépendre du graphique.
Critères : mêmes valeurs que la courbe ; tableau synchronisé avec le filtre ; en-têtes de colonnes lisibles par un lecteur d'écran.

**US5, utiliser le site sur mobile et au clavier.** En tant que visiteur, je veux utiliser l'application quel que soit mon équipement.
Critères : lisible sur 375 px de large sans défilement horizontal ; chaque contrôle accessible avec Tab, avec un focus visible ; contrastes conformes au niveau AA des WCAG.

**US6, importer les données NOAA sans doublon.** En tant qu'administrateur, je veux lancer l'import de l'ONI, afin de disposer de données à jour, traçables et sans doublon.
Critères : copie brute datée et son empreinte SHA-256 ; aucune saison enregistrée deux fois ; valeurs révisées mises à jour ; import tracé avec ses compteurs et son statut ; relancer l'import sans changement côté NOAA n'insère rien.

**US7, voir les épisodes détectés (extension).** En tant que visiteur, je veux voir la liste des épisodes détectés, afin de choisir plus facilement ceux à comparer.
Critères : règle de la NOAA appliquée (±0,5 °C pendant au moins 5 saisons consécutives) et affichée à côté de la liste.

## Priorisation

J'ai classé les stories avec la méthode MoSCoW :

- **Must** : US1 à US6. Elles couvrent les quatre fonctionnalités du MVP et les exigences d'accessibilité.
- **Should** : aucune. Chaque besoin était soit indispensable au MVP, soit un simple confort.
- **Could** : US7. La comparaison fonctionne sans elle, puisque le visiteur peut choisir ses périodes à la main.
- **Won't** : prévisions climatiques, second indice (RONI), carte Copernicus ERA5, interface d'administration web, exports et statistiques avancées, classification « Super El Niño », déploiement réel. Ces exclusions sont justifiées dans les arbitrages de la section 5.

## Parcours utilisateurs

**Visiteur, parcours principal.**

1. À l'ouverture, la courbe couvre toute la période depuis 1950, avec la source et l'unité dans l'en-tête.
2. Le visiteur choisit une période et la valide avec « Appliquer » : la courbe et le tableau se mettent à jour.
3. Les lignes de seuil lui montrent quand l'indice dépasse +0,5 °C (El Niño) ou descend sous -0,5 °C (La Niña).
4. Dans la comparaison, deux épisodes El Niño sont proposés par défaut (1997-1998 et 2014-2016). Il peut les modifier, puis clique sur « Comparer » : les indicateurs, l'interprétation et les limites s'affichent.

En cas d'erreur, un message explique le problème sans effacer ce qui était affiché : début après la fin, période sans donnée, API injoignable, ou période de comparaison vide.

**Administrateur, import des données.** Il lance la commande d'import. L'ETL télécharge la page ONI v6, en garde une copie datée avec son empreinte, nettoie les valeurs, insère les nouvelles et met à jour celles que la NOAA a révisées, puis affiche le bilan. Si la NOAA est injoignable, l'import est enregistré en échec, et le site continue de fonctionner avec les données déjà en base.

## Wireframes

![Wireframes desktop et mobile](diagrams/wireframe.drawio.svg)

Sur ordinateur, l'en-tête regroupe le titre, la source, la version, la date d'extraction et l'unité. Le filtre est au-dessus d'une courbe pleine largeur, puis viennent le tableau et la comparaison. Sur mobile, les mêmes zones sont empilées dans le même ordre, et le tableau est replié par défaut pour ne pas allonger la page de plus de 900 lignes.

L'application suit ce découpage, avec une différence : sur ordinateur aussi, la comparaison est placée sous le tableau et non à côté, pour laisser assez de largeur aux deux formulaires d'épisode.
