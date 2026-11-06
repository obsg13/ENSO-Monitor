from datetime import date, datetime, timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db import get_session
from app.main import app
from app.models import Base, ClimateIndex, ImportRun, Observation, Source

TEST_OBSERVATIONS = [
    ("NDJ", date(1996, 12, 1), -0.5),
    ("DJF", date(1997, 1, 1), -0.4),
    ("NDJ", date(1997, 12, 1), 2.4),
    ("DJF", date(1998, 1, 1), 2.2),
    ("DJF", date(1999, 1, 1), -1.5),
]


@pytest.fixture
def client():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(engine)
    TestingSession = sessionmaker(bind=engine)

    with TestingSession() as session:
        source = Source(name="NOAA Climate Prediction Center", url="https://example.org")
        session.add(source)
        session.flush()
        index = ClimateIndex(
            source_id=source.id,
            code="ONI",
            name="Oceanic Niño Index",
            unit="°C",
            dataset_version="ERSSTv6",
        )
        session.add(index)
        session.flush()
        run = ImportRun(
            climate_index_id=index.id, started_at=datetime.now(timezone.utc), status="success"
        )
        session.add(run)
        session.flush()
        for season, period_date, value in TEST_OBSERVATIONS:
            session.add(
                Observation(
                    climate_index_id=index.id,
                    import_run_id=run.id,
                    season=season,
                    period_date=period_date,
                    value=value,
                )
            )
        session.commit()

    def override_get_session():
        with TestingSession() as session:
            yield session

    app.dependency_overrides[get_session] = override_get_session
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_observations_filtered_by_period(client):
    response = client.get(
        "/api/v1/observations", params={"start": "1997-01-01", "end": "1998-12-01"}
    )

    assert response.status_code == 200
    assert response.json() == [
        {"season": "DJF", "period_date": "1997-01-01", "value": -0.4},
        {"season": "NDJ", "period_date": "1997-12-01", "value": 2.4},
        {"season": "DJF", "period_date": "1998-01-01", "value": 2.2},
    ]


def test_observations_rejects_start_after_end(client):
    response = client.get(
        "/api/v1/observations", params={"start": "1998-12-01", "end": "1997-01-01"}
    )

    assert response.status_code == 422
    assert response.json()["detail"] == "La date de début doit précéder la date de fin"
