# Backlog — ENSO Monitor

Chaque tâche indique la user story concernée, sa priorité MoSCoW, son estimation et son statut. Le planning, les risques et les arbitrages sont présentés dans la section 5 du dossier de conception (`docs/dossier.pdf`).

## Conception

- **T01** User stories et priorisation MoSCoW (Must, 1 h) : Fait.
- **T02** Parcours utilisateurs (Must, 0,5 h) : Fait.
- **T03** Diagramme de cas d'utilisation (Must, 1 h) : Fait.
- **T04** Diagramme de classes et modèle de données (US6, Must, 1 h) : Fait.
- **T05** Wireframes desktop et mobile (US1–US5, Must, 1 h) : Fait.
- **T06** Schéma d'architecture logique (Must, 0,5 h) : Fait.
- **T07** Backlog, planning et risques (Must, 0,5 h) : Fait.

## Base de données et ETL

- **T08** PostgreSQL avec Docker Compose (service db) (US6, Must, 0,5 h) : Fait.
- **T09** Modèles SQLAlchemy et première migration Alembic (US6, Must, 2 h) : Fait.
- **T10** ETL extraction : copie datée de la page NOAA + SHA-256 (US6, Must, 1 h) : Fait.
- **T11** ETL transformation : saisons en dates, doublons, invalides (US6, Must, 2 h) : Fait.
- **T12** ETL chargement et enregistrement de l'ImportRun (US6, Must, 2 h) : Fait.
- **T13** Test 1 : transformation des données (Pytest) (US6, Must, 1 h) : Fait.

## API

- **T14** Application FastAPI, connexion à la base, /api/v1, health (US1, Must, 1 h) : Fait.
- **T15** Routes indices et observations, schémas Pydantic, 404 et 422 (US1, US2, Must, 2 h) : Fait.
- **T16** Route de comparaison de deux périodes (US3, Must, 2 h) : Fait.
- **T17** CORS et vérification des requêtes paramétrées (US1, Must, 0,5 h) : Fait.
- **T18** Test 2 : route observations filtrée (Pytest) (US2, Must, 1 h) : Fait.
- **T19** Diagramme de séquence (US1, Must, 1 h) : Fait.
- **T20** Détection automatique des épisodes et route episodes (US7, Could, 2 h) : Non réalisée (extension).

## Interface

- **T21** Projet Vite React TS strict, oxlint, Prettier (Must, 0,5 h) : Fait.
- **T22** Types, client API et hook de chargement (US1, US2, Must, 1,5 h) : Fait.
- **T23** En-tête, filtre, courbe, états de chargement et d'erreur (US1, US2, Must, 3 h) : Fait.
- **T24** Tableau des valeurs (US4, Must, 1 h) : Fait.
- **T25** Comparaison : sélection, indicateurs, interprétation, limites (US3, Must, 2 h) : Fait.
- **T26** Responsive, navigation au clavier, contrastes (US5, Must, 1,5 h) : Fait.
- **T27** Test 3 : changement de période (Vitest) (US2, Must, 1 h) : Fait.

## Docker, qualité et livrables

- **T28** compose.yaml complet (db, api, etl, frontend) (Must, 2 h) : Fait.
- **T29** Ruff, oxlint et captures des tests (Must, 1 h) : Fait.
- **T30** Bug de démonstration et test de non-régression (Must, 1 h) : Fait.
- **T31** README complet (Must, 1 h) : Fait.
- **T32** Dossier de conception PDF (8 sections) (Must, 6 h) : Fait.
- **T33** Préparation de l'oral (Must, 2 h) : À faire.
