from collections.abc import Sequence

from app.models import Observation
from app.schemas import PeriodStats


def compute_period_stats(observations: Sequence[Observation]) -> PeriodStats:
    peak = max(observations, key=lambda obs: abs(obs.value))
    mean = sum(obs.value for obs in observations) / len(observations)
    return PeriodStats(
        start=observations[0].period_date,
        end=observations[-1].period_date,
        seasons=len(observations),
        peak_value=peak.value,
        peak_season=peak.season,
        peak_date=peak.period_date,
        mean_value=round(mean, 2),
    )
