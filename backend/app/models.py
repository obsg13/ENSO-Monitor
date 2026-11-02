from datetime import date, datetime

from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    Float,
    ForeignKey,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

SEASONS = ("DJF", "JFM", "FMA", "MAM", "AMJ", "MJJ", "JJA", "JAS", "ASO", "SON", "OND", "NDJ")


class Base(DeclarativeBase):
    pass


class Source(Base):
    __tablename__ = "source"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    url: Mapped[str] = mapped_column(String(500))


class ClimateIndex(Base):
    __tablename__ = "climate_index"

    id: Mapped[int] = mapped_column(primary_key=True)
    source_id: Mapped[int] = mapped_column(ForeignKey("source.id"))
    code: Mapped[str] = mapped_column(String(20), unique=True)
    name: Mapped[str] = mapped_column(String(200))
    unit: Mapped[str] = mapped_column(String(20))
    dataset_version: Mapped[str] = mapped_column(String(50))


class ImportRun(Base):
    __tablename__ = "import_run"
    __table_args__ = (
        CheckConstraint(
            "status IN ('running', 'success', 'failed')",
            name="ck_import_run_status",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    climate_index_id: Mapped[int] = mapped_column(ForeignKey("climate_index.id"))
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    raw_file_path: Mapped[str | None] = mapped_column(String(500))
    sha256: Mapped[str | None] = mapped_column(String(64))
    rows_read: Mapped[int] = mapped_column(default=0)
    rows_inserted: Mapped[int] = mapped_column(default=0)
    rows_updated: Mapped[int] = mapped_column(default=0)
    rows_skipped: Mapped[int] = mapped_column(default=0)
    status: Mapped[str] = mapped_column(String(20))


class Observation(Base):
    __tablename__ = "observation"
    __table_args__ = (
        UniqueConstraint(
            "climate_index_id", "period_date", name="uq_observation_index_date"
        ),
        CheckConstraint("value BETWEEN -5 AND 5", name="ck_observation_value_range"),
        CheckConstraint(
            "season IN (" + ", ".join(f"'{s}'" for s in SEASONS) + ")",
            name="ck_observation_season",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    climate_index_id: Mapped[int] = mapped_column(ForeignKey("climate_index.id"))
    import_run_id: Mapped[int] = mapped_column(ForeignKey("import_run.id"))
    season: Mapped[str] = mapped_column(String(3))
    period_date: Mapped[date] = mapped_column(Date)
    value: Mapped[float] = mapped_column(Float)
