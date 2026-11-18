from datetime import date

from app.analysis import compute_period_stats
from app.models import Observation


def test_period_stats_keep_both_extremes():
    observations = [
        Observation(season="NDJ", period_date=date(1997, 12, 1), value=2.4),
        Observation(season="JFM", period_date=date(1998, 2, 1), value=1.9),
        Observation(season="NDJ", period_date=date(1998, 12, 1), value=-1.5),
    ]

    stats = compute_period_stats(observations)

    assert stats.max_value == 2.4
    assert stats.min_value == -1.5
    assert stats.peak_value == 2.4
