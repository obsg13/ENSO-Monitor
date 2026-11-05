from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class ClimateIndexOut(BaseModel):
    code: str
    name: str
    unit: str
    dataset_version: str
    source_name: str
    source_url: str
    last_import_at: datetime | None


class ObservationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    season: str
    period_date: date
    value: float
