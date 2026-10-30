# Organisation du projet — ENSO Monitor

## Backlog

| ID  | Tâche                                                         | Story    | Priorité | Estimation | Statut   |
|-----|---------------------------------------------------------------|----------|----------|------------|----------|
| T01 | User stories et priorisation MoSCoW                           | —        | Must     | 1 h        | Fait     |
| T02 | Parcours utilisateurs                                         | —        | Must     | 0,5 h      | Fait     |
| T03 | Diagramme de cas d'utilisation                                | —        | Must     | 1 h        | Fait     |
| T04 | Diagramme de classes et modèle de données                     | US6      | Must     | 1 h        | Fait     |
| T05 | Wireframes desktop et mobile                                  | US1–US5  | Must     | 1 h        | Fait     |
| T06 | Schéma d'architecture logique                                 | —        | Must     | 0,5 h      | Fait     |
| T07 | Backlog, planning et risques                                  | —        | Must     | 0,5 h      | En cours |
| T08 | PostgreSQL avec Docker Compose (service db)                   | US6      | Must     | 0,5 h      | À faire  |
| T09 | Modèles SQLAlchemy et première migration Alembic              | US6      | Must     | 2 h        | À faire  |
| T10 | ETL extraction : copie datée de la page NOAA + SHA-256        | US6      | Must     | 1 h        | À faire  |
| T11 | ETL transformation : saisons en dates, doublons, invalides    | US6      | Must     | 2 h        | À faire  |
| T12 | ETL chargement et enregistrement de l'ImportRun               | US6      | Must     | 2 h        | À faire  |
| T13 | Test 1 : transformation des données (Pytest)                  | US6      | Must     | 1 h        | À faire  |
| T14 | Application FastAPI, connexion à la base, /api/v1, health     | US1      | Must     | 1 h        | À faire  |
| T15 | Routes indices et observations, schémas Pydantic, 404 et 422  | US1, US2 | Must     | 2 h        | À faire  |
| T16 | Route de comparaison de deux périodes                         | US3      | Must     | 2 h        | À faire  |
| T17 | CORS et vérification des requêtes paramétrées                 | US1      | Must     | 0,5 h      | À faire  |
| T18 | Test 2 : route observations filtrée (Pytest)                  | US2      | Must     | 1 h        | À faire  |
| T19 | Diagramme de séquence                                         | US1      | Must     | 1 h        | À faire  |
| T20 | Détection automatique des épisodes et route episodes          | US7      | Could    | 2 h        | À faire  |
| T21 | Projet Vite React TS strict, ESLint, Prettier                 | —        | Must     | 0,5 h      | À faire  |
| T22 | Types, client API et hook de chargement                       | US1, US2 | Must     | 1,5 h      | À faire  |
| T23 | En-tête, filtre, courbe, états de chargement et d'erreur      | US1, US2 | Must     | 3 h        | À faire  |
| T24 | Tableau des valeurs                                           | US4      | Must     | 1 h        | À faire  |
| T25 | Comparaison : sélection, indicateurs, interprétation, limites | US3      | Must     | 2 h        | À faire  |
| T26 | Responsive, navigation au clavier, contrastes                 | US5      | Must     | 1,5 h      | À faire  |
| T27 | Test 3 : changement de période (Vitest)                       | US2      | Must     | 1 h        | À faire  |
| T28 | compose.yaml complet (db, api, etl, frontend)                 | —        | Must     | 2 h        | À faire  |
| T29 | Ruff, ESLint et captures des tests                            | —        | Must     | 1 h        | À faire  |
| T30 | Bug de démonstration et test de non-régression                | —        | Must     | 1 h        | À faire  |
| T31 | README complet                                                | —        | Must     | 1 h        | À faire  |
| T32 | Dossier de conception PDF (8 sections)                        | —        | Must     | 6 h        | À faire  |
| T33 | Préparation de l'oral                                         | —        | Must     | 2 h        | À faire  |

Statuts : À faire, En cours, Fait. Le backlog est mis à jour chaque soir.

## Planning sur 5 jours

| Jour | Objectif                        | Tâches           | Livrable de fin de journée                       |
|------|---------------------------------|------------------|--------------------------------------------------|
| J1   | Installation et conception      | T01 à T08        | Diagrammes, wireframes, base PostgreSQL lancée   |
| J2   | Base de données et ETL          | T09 à T13        | Données ONI importées en base, test 1 réussi     |
| J3   | API                             | T14 à T19 (+T20) | API documentée sur /docs, test 2 réussi          |
| J4   | Interface                       | T21 à T27        | Courbe, filtre et comparaison fonctionnels, test 3 réussi |
| J5   | Docker, qualité et livrables    | T28 à T33        | Projet lancé d'une commande, README, dossier PDF |

Chaque soir : mise à jour des statuts du backlog, rédaction d'une partie du dossier, au moins trois commits poussés.
