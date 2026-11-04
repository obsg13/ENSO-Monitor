from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.models import ImportRun
from etl.extract import ONI_URL, RAW_DIR, download_oni_page
from etl.load import get_or_create_oni_index, load_observations
from etl.transform import transform


def run_import(session: Session) -> ImportRun:
    index = get_or_create_oni_index(session, ONI_URL)
    run = ImportRun(
        climate_index_id=index.id,
        started_at=datetime.now(timezone.utc),
        status="running",
    )
    session.add(run)
    session.commit()

    try:
        path, sha256 = download_oni_page()
        run.raw_file_path = str(path.relative_to(RAW_DIR.parents[1]))
        run.sha256 = sha256
        session.commit()

        observations, rows_read = transform(path.read_text(encoding="utf-8"))
        inserted, updated, _ = load_observations(session, index.id, run.id, observations)

        run.rows_read = rows_read
        run.rows_inserted = inserted
        run.rows_updated = updated
        run.rows_skipped = rows_read - inserted - updated
        run.status = "success"
    except Exception:
        session.rollback()
        run.status = "failed"
        raise
    finally:
        run.finished_at = datetime.now(timezone.utc)
        session.commit()

    return run


def main() -> None:
    with SessionLocal() as session:
        run = run_import(session)
        print(
            f"Import {run.id} terminé ({run.status}) : {run.rows_read} lues, "
            f"{run.rows_inserted} insérées, {run.rows_updated} mises à jour, "
            f"{run.rows_skipped} ignorées."
        )


if __name__ == "__main__":
    main()
