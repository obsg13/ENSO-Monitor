import hashlib
from datetime import datetime, timezone
from pathlib import Path

import httpx

ONI_URL = "https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso/oni/v6/index.php"
RAW_DIR = Path(__file__).resolve().parents[2] / "data" / "raw"


def download_oni_page(url: str = ONI_URL, raw_dir: Path = RAW_DIR) -> tuple[Path, str]:
    response = httpx.get(url, timeout=30)
    response.raise_for_status()
    content = response.content

    raw_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    path = raw_dir / f"oni_v6_{timestamp}.html"
    path.write_bytes(content)

    sha256 = hashlib.sha256(content).hexdigest()
    return path, sha256
