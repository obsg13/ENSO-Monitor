from datetime import date
from pathlib import Path

import pandas as pd

from etl.transform import clean_observations, transform

RAW_FILE = (
    Path(__file__).resolve().parents[2] / "data" / "raw" / "oni_v6_20261104T122258Z.html"
)


def test_clean_observations_removes_duplicates_and_invalid_rows():
    raw = pd.DataFrame(
        {
            "year": ["1997", "1997", "1997", "1997"],
            "season": ["DJF", "DJF", "XYZ", "JFM"],
            "value": ["-0.5", "-0.4", "0.1", ""],
        }
    )

    result = clean_observations(raw)

    assert len(result) == 1
    assert result.loc[0, "season"] == "DJF"
    assert result.loc[0, "period_date"] == date(1997, 1, 1)
    assert result.loc[0, "value"] == -0.5


def test_transform_reads_saved_noaa_page():
    observations, rows_read = transform(RAW_FILE.read_text(encoding="utf-8"))

    assert rows_read == 924
    assert len(observations) == 921
    assert observations["period_date"].is_unique
    first = observations.iloc[0]
    assert (first["season"], first["period_date"], first["value"]) == ("DJF", date(1950, 1, 1), -1.3)
