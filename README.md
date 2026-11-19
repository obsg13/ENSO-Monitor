# ENSO Monitor

Application web d'exploration de l'indice ONI (Oceanic Niño Index) publié par la NOAA, pour visualiser les épisodes El Niño et La Niña depuis 1950 et comparer deux épisodes historiques.

Projet individuel — HETIC, Web3, sujet de rattrapage 2026.

## Fonctionnalités

- Import de l'indice ONI v6 depuis la NOAA, avec copie brute datée, empreinte SHA-256 et contrôle des doublons.
- API FastAPI documentée (`/api/v1`), avec filtrage par période et validation des entrées.
- Courbe interactive avec seuils de ±0,5 °C, filtre de période, unité et source visibles, tableau accessible.
- Comparaison de deux épisodes (durée, pic, saison du pic, moyenne) avec une interprétation prudente et ses limites.

## Architecture

```
NOAA (page ONI v6) → ETL Python/pandas → PostgreSQL → API FastAPI → Interface React/TypeScript
```

- `backend/app/` : API FastAPI, modèles SQLAlchemy, schémas Pydantic
- `backend/etl/` : import NOAA (extraction, transformation, chargement)
- `backend/alembic/` : migrations de la base de données
- `backend/tests/` : tests Pytest (données, API, calculs)
- `frontend/` : interface React + TypeScript (Vite) et tests Vitest
- `data/raw/` : copies brutes datées de la page NOAA
- `docs/` : conception, diagrammes UML, captures des tests

## Prérequis

- Docker et Docker Compose v2 (lancement complet)
- Python 3.12 et Node.js 22 (développement local)
- Git

## Configuration

Copier le modèle de variables d'environnement, puis remplacer `change_me` par un mot de passe (lettres et chiffres uniquement) aux deux endroits où il apparaît :

```bash
cp .env.example .env
```

Variables attendues :

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` : identifiants de la base PostgreSQL.
- `DATABASE_URL` : adresse de connexion utilisée par l'API et l'ETL en développement local.
- `CORS_ORIGINS` : origine autorisée à appeler l'API (adresse du front en développement).

Le fichier `.env` contient des secrets et n'est pas versionné. En mode Docker, `DATABASE_URL` et `CORS_ORIGINS` sont définis dans `compose.yaml`.

## Lancement avec Docker (recommandé)

```bash
docker compose up -d --build      # base, API et interface
docker compose run --rm etl       # import des données NOAA
```

L'application est disponible sur http://localhost:8080, et la vérification de santé de l'API sur http://localhost:8080/api/v1/health. Caddy sert l'interface et relaie `/api` vers FastAPI.

Arrêt : `docker compose down` (les données sont conservées dans le volume `db_data`).

## Lancement en développement local

```bash
docker compose up -d db                     # base seule

cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head                        # création des tables
python -m etl.run                           # import NOAA
uvicorn app.main:app --reload               # API sur http://127.0.0.1:8000 (documentation : /docs)
```

Dans un second terminal :

```bash
cd frontend
npm install
npm run dev                                 # interface sur http://localhost:5173
```

## Jeu de données

- **Source** : NOAA Climate Prediction Center, https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso/oni/v6/index.php
- **Indice** : ONI (Oceanic Niño Index), version 6, données de température ERSSTv6.
- **Unité** : °C, anomalie de température de surface de la mer dans la région Niño 3.4.
- **Période couverte** : 1950 à 2026, soit 921 valeurs saisonnières.
- **Dernière extraction versionnée** : 17/11/2026 (`data/raw/oni_v6_20261117T155240Z.html`).

Chaque import est tracé dans la table `import_run` : date, copie brute, empreinte SHA-256, lignes lues, insérées, mises à jour et ignorées. La NOAA pouvant réviser les valeurs récentes pendant deux mois, l'import met à jour les valeurs révisées sans créer de doublon.

## Tests

```bash
cd backend && python -m pytest       # 5 tests : transformation, API, calculs
cd frontend && npm test              # 2 tests : filtre de période, interprétation
```

Les trois tests exigés et leur preuve d'exécution :

1. **Données** — transformation des observations NOAA (doublon, saison invalide, case vide) : `backend/tests/test_transform.py`, capture `docs/screenshots/test1-transform.png`.
2. **API** — route filtrée par période et entrée invalide (422) : `backend/tests/test_api.py`, capture `docs/screenshots/test2-api.png`.
3. **Frontend** — un changement de période met à jour les valeurs affichées : `frontend/src/App.test.tsx`, capture `docs/screenshots/test3-front.png`.

Deux tests de non-régression accompagnent la correction d'une anomalie : `backend/tests/test_analysis.py` et `frontend/src/interpretation.test.ts` (détails dans `docs/conception/06-anomalies.md`).

## Qualité

```bash
cd backend && ruff check . && ruff format --check .
cd frontend && npm run lint && npx prettier --check src
```

## Utilisation de l'intelligence artificielle

Outil utilisé : Claude (Anthropic), via Claude Code dans VS Code.

Parties assistées :

- planification du projet, découpage en étapes et choix techniques, proposés puis discutés et validés ;
- propositions de code pour l'ETL, l'API, l'interface et les tests, que j'ai saisies, relues, exécutées et vérifiées ;
- aide à la rédaction de la documentation de conception ;
- relecture du code, des diagrammes et des résultats de tests.

Chaque choix et chaque partie du code a été compris et peut être justifié. Les données climatiques affichées sont réelles (NOAA) et les tests mentionnés ont été réellement exécutés (captures dans `docs/screenshots/`).
