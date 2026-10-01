import json
import sys
from pathlib import Path

import pytest

DATA = Path(__file__).resolve().parent.parent
RAW = DATA / "raw"
sys.path.insert(0, str(DATA / "scripts"))


def load_json(rel):
    return json.loads((DATA / rel).read_text(encoding="utf-8"))


@pytest.fixture(scope="session")
def lexicon():
    return load_json("lexicon/lexicon.json")


@pytest.fixture(scope="session")
def manifest():
    return load_json("dict/manifest.json")


@pytest.fixture(scope="session")
def shards(manifest):
    return {f: load_json("dict/" + f) for f in manifest["shards"].values()}


def needs_raw(name):
    """需要 data/raw/ 原始檔的測試（本機跑；CI 無下載快取時略過）。"""
    return pytest.mark.skipif(not (RAW / name).exists(), reason=f"data/raw/{name} 不存在（先跑 fetch.py）")
