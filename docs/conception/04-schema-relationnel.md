# 4. Architecture technique — schéma relationnel

## Tables

Notation : **clé primaire** en gras, `#` pour une clé étrangère.

- source (**id**, name, url)
- climate_index (**id**, #source_id, code, name, unit, dataset_version)
- import_run (**id**, #climate_index_id, started_at, finished_at, raw_file_path, sha256, rows_read, rows_inserted, rows_updated, rows_skipped, status)
- observation (**id**, #climate_index_id, #import_run_id, season, period_date, value)

## Clés étrangères

| Colonne | Référence | Signification |
|---------|-----------|---------------|
| climate_index.source_id | source.id | Organisme qui publie l'indice |
| import_run.climate_index_id | climate_index.id | Indice concerné par l'import |
| observation.climate_index_id | climate_index.id | Indice auquel appartient la valeur |
| observation.import_run_id | import_run.id | Import qui a écrit ou révisé la valeur en dernier |

## Contraintes d'intégrité

| Contrainte | Table | Règle | Rôle |
|------------|-------|-------|------|
| uq_observation_index_date | observation | UNIQUE (climate_index_id, period_date) | Interdit les doublons |
| ck_observation_value_range | observation | value BETWEEN -5 AND 5 | Rejette les valeurs aberrantes |
| ck_observation_season | observation | season parmi les 12 saisons NOAA | Rejette les saisons invalides |
| ck_import_run_status | import_run | status IN ('running', 'success', 'failed') | Garantit un statut connu |
| UNIQUE (code) | climate_index | un seul indice par code | Évite deux indices « ONI » |
| NOT NULL | toutes | colonnes obligatoires | Seules finished_at, raw_file_path et sha256 peuvent être vides, tant que l'import n'a pas abouti |

## Index

La contrainte d'unicité sur (climate_index_id, period_date) crée un index. Il sert aussi la requête principale de l'API, qui filtre les observations d'un indice sur une période de dates. Aucun index supplémentaire n'est nécessaire pour ce volume (environ 920 lignes).

## Migrations

Le schéma est créé par Alembic à partir des modèles SQLAlchemy (backend/app/models.py). La migration initiale crée les quatre tables et leurs contraintes ; chaque évolution future de structure fera l'objet d'une nouvelle migration versionnée, réversible par downgrade.

## Provenance des observations

Chaque valeur est traçable jusqu'à sa source :

observation → import_run (date d'extraction, fichier brut dans data/raw, empreinte SHA-256) → climate_index (ONI, °C, ERSSTv6) → source (NOAA CPC, URL de la page).

L'empreinte permet de vérifier que la copie brute conservée dans le dépôt n'a pas été modifiée depuis l'import.
