from datetime import date
from io import StringIO

import numpy as np
import pandas as pd

from app.models import SEASONS


def read_oni_table(html: str) -> pd.DataFrame:
    header = ["Year", *SEASONS]
    for table in pd.read_html(StringIO(html)):
        if table.shape[1] == 13 and table.iloc[0].tolist() == header:
            table.columns = header
            return table[table["Year"] != "Year"]
    raise ValueError("Tableau ONI introuvable dans la page NOAA")


def to_long_format(wide: pd.DataFrame) -> pd.DataFrame:
    return wide.rename(columns={"Year": "year"}).melt(
        id_vars="year", var_name="season", value_name="value"
    )


def clean_observations(raw: pd.DataFrame) -> pd.DataFrame:
    df = raw.copy()
    df["year"] = pd.to_numeric(df["year"], errors="coerce")
    df["value"] = pd.to_numeric(df["value"].replace("", np.nan), errors="coerce")

    df = df[df["season"].isin(SEASONS)]
    df = df.dropna(subset=["year", "value"])
    df = df[df["value"].between(-5, 5)]

    df["period_date"] = [
        date(int(year), SEASONS.index(season) + 1, 1)
        for year, season in zip(df["year"], df["season"])
    ]
    df = df.drop_duplicates(subset="period_date", keep="first")

    return df[["season", "period_date", "value"]].sort_values("period_date").reset_index(drop=True)


def transform(html: str) -> tuple[pd.DataFrame, int]:
    long = to_long_format(read_oni_table(html))
    return clean_observations(long), len(long)
