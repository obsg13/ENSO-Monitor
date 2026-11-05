from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select, text
from sqlalchemy.orm import Session

from app.db import get_session
from app.models import ClimateIndex, ImportRun, Observation, Source
from app.schemas import ClimateIndexOut, ObservationOut

router = APIRouter(prefix="/api/v1")
SessionDep = Annotated[Session, Depends(get_session)]


def get_index_or_404(session: Session, code: str) -> ClimateIndex:
    climate_index = session.scalar(select(ClimateIndex).where(ClimateIndex.code == code))
    if climate_index is None:
        raise HTTPException(status_code=404, detail=f"Indice inconnu : {code}")
    return climate_index


@router.get("/health")
def health(session: SessionDep) -> dict[str, str]:
    session.execute(text("SELECT 1"))
    return {"status": "ok"}


@router.get("/indices", response_model=list[ClimateIndexOut])
def list_indices(session: SessionDep):
    rows = session.execute(
        select(ClimateIndex, Source).join(Source, ClimateIndex.source_id == Source.id)
    ).all()
    result = []
    for climate_index, source in rows:
        last_import_at = session.scalar(
            select(func.max(ImportRun.finished_at)).where(
                ImportRun.climate_index_id == climate_index.id,
                ImportRun.status == "success",
            )
        )
        result.append(
            ClimateIndexOut(
                code=climate_index.code,
                name=climate_index.name,
                unit=climate_index.unit,
                dataset_version=climate_index.dataset_version,
                source_name=source.name,
                source_url=source.url,
                last_import_at=last_import_at,
            )
        )
    return result


@router.get("/observations", response_model=list[ObservationOut])
def list_observations(
    session: SessionDep,
    index: Annotated[str, Query(description="Code de l'indice, par exemple ONI")] = "ONI",
    start: Annotated[date | None, Query(description="Date de début incluse (AAAA-MM-JJ)")] = None,
    end: Annotated[date | None, Query(description="Date de fin incluse (AAAA-MM-JJ)")] = None,
):
    if start and end and start > end:
        raise HTTPException(
            status_code=422, detail="La date de début doit précéder la date de fin"
        )
    climate_index = get_index_or_404(session, index)

    query = select(Observation).where(Observation.climate_index_id == climate_index.id)
    if start:
        query = query.where(Observation.period_date >= start)
    if end:
        query = query.where(Observation.period_date <= end)
    return session.scalars(query.order_by(Observation.period_date)).all()
