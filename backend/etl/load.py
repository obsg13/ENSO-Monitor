import pandas as pd
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import ClimateIndex, Observation, Source

NOAA_SOURCE_NAME = "NOAA Climate Prediction Center"
ONI_CODE = "ONI"
ONI_NAME = "Oceanic Niño Index"
ONI_UNIT = "°C"
ONI_DATASET_VERSION = "ERSSTv6"


def get_or_create_oni_index(session: Session, source_url: str) -> ClimateIndex:
    index = session.scalar(select(ClimateIndex).where(ClimateIndex.code == ONI_CODE))
    if index is not None:
        return index

    source = Source(name=NOAA_SOURCE_NAME, url=source_url)
    session.add(source)
    session.flush()

    index = ClimateIndex(
        source_id=source.id,
        code=ONI_CODE,
        name=ONI_NAME,
        unit=ONI_UNIT,
        dataset_version=ONI_DATASET_VERSION,
    )
    session.add(index)
    session.flush()
    return index


def load_observations(
    session: Session, index_id: int, import_run_id: int, observations: pd.DataFrame
) -> tuple[int, int, int]:
    existing = {
        obs.period_date: obs
        for obs in session.scalars(
            select(Observation).where(Observation.climate_index_id == index_id)
        )
    }

    inserted = updated = unchanged = 0
    for row in observations.itertuples(index=False):
        current = existing.get(row.period_date)
        if current is None:
            session.add(
                Observation(
                    climate_index_id=index_id,
                    import_run_id=import_run_id,
                    season=row.season,
                    period_date=row.period_date,
                    value=row.value,
                )
            )
            inserted += 1
        elif current.value != row.value:
            current.value = row.value
            current.import_run_id = import_run_id
            updated += 1
        else:
            unchanged += 1

    return inserted, updated, unchanged
