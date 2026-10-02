"""TASK-17 AC#1：分級測驗假字池對 ECDICT 完整原檔（ecdict.csv 全部列，含無釋義者）比對。

repo 內的字典切片是篩選過的子集；本測試讀 data/raw/ecdict.csv 原檔，CI 無原檔時略過。
環境變數 PLACEMENT_PSEUDOWORDS 可指定另一份假字清單（一行一字），用於驗產生器的其他種子輸出。
"""

import csv
import json
import os
from pathlib import Path

from conftest import DATA, RAW, needs_raw

PLACEMENT = DATA.parent / "content" / "placement" / "placement.json"


def pseudowords():
    extra = os.environ.get("PLACEMENT_PSEUDOWORDS")
    if extra:
        return [w.strip() for w in Path(extra).read_text(encoding="utf-8").splitlines() if w.strip()]
    return json.loads(PLACEMENT.read_text(encoding="utf-8"))["pseudowords"]


@needs_raw("ecdict.csv")
def test_pseudowords_not_in_full_ecdict():
    csv.field_size_limit(1 << 30)
    with open(RAW / "ecdict.csv", encoding="utf-8", newline="") as f:
        words = {r["word"].strip().lower() for r in csv.DictReader(f)}
    assert len(words) > 700_000  # 確認讀到的是完整原檔
    pool = pseudowords()
    assert len(pool) >= 200
    assert [w for w in pool if w in words] == []
