"""下載單字資料來源到 data/raw/，並以 sources.lock.json 的 sha256 驗證。

已存在且 checksum 相符的檔案略過；下載失敗時請手動把檔案放進 data/raw/（檔名同 lock），
再跑一次本腳本驗證。checksum 不符一律失敗，不覆寫鎖檔。
"""

import hashlib
import json
import sys
import urllib.request
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent
RAW = DATA / "raw"
LOCK = Path(__file__).resolve().parent / "sources.lock.json"


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def main():
    RAW.mkdir(exist_ok=True)
    failed = []
    for src in json.loads(LOCK.read_text(encoding="utf-8")):
        path = RAW / src["file"]
        if not path.exists():
            print(f"下載 {src['file']}")
            req = urllib.request.Request(src["url"], headers={"User-Agent": "Mozilla/5.0"})
            try:
                with urllib.request.urlopen(req, timeout=300) as r, open(path, "wb") as f:
                    f.write(r.read())
            except OSError as e:
                print(f"  失敗：{e}；請手動放置 {path}")
                failed.append(src["file"])
                continue
        got = sha256(path)
        if got != src["sha256"]:
            print(f"  checksum 不符 {src['file']}: {got}")
            failed.append(src["file"])
        else:
            print(f"OK {src['file']}")
    if failed:
        sys.exit(f"失敗：{failed}")


if __name__ == "__main__":
    main()
