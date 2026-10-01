"""產生人工比對用的抽樣報告（固定亂數種子，可重現）。

reports/sample30.md   ：30 筆 lexicon 與原始 CSV 逐列對照（AC#2）
reports/sample50-zh.md：50 條字典釋義的簡體原文與繁中輸出對照（AC#3）
"""

import csv
import json
import random
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent
RAW = DATA / "raw"
SEED = 20261001


def raw_rows(name, key, word, enc="utf-8"):
    with open(RAW / name, encoding=enc, newline="") as f:
        return [r for r in csv.DictReader(f) if word in [p.strip().lower() for p in r[key].split("/")]]


def ecdict_raw(words):
    csv.field_size_limit(1 << 30)
    out = {}
    with open(RAW / "ecdict.csv", encoding="utf-8", newline="") as f:
        for r in csv.DictReader(f):
            if r["word"] in words:
                out[r["word"]] = r
    return out


def cell(s):
    return str(s).replace("|", "\\|").replace("\n", " ⏎ ")


def main():
    rnd = random.Random(SEED)
    lexicon = json.loads((DATA / "lexicon/lexicon.json").read_text(encoding="utf-8"))
    picks = sorted(rnd.sample(lexicon, 30), key=lambda e: e["id"])
    ec = ecdict_raw({e["headword"] for e in picks})

    lines = [
        "# lexicon 抽樣 30 筆 vs 原始來源（seed 20261001）",
        "",
        "| lexicon | 原 CEFR 表列 | TSL／NGSL 原表 | ECDICT 原 frq／釋義 |",
        "|---|---|---|---|",
    ]
    for e in picks:
        w = e["headword"].lower()
        src = raw_rows("cefrj-vocabulary-profile-1.5.csv", "headword", w) + raw_rows(
            "octanove-vocabulary-profile-c1c2-1.0.csv", "headword", w)
        src_txt = "; ".join(f"{r['headword']},{r['pos']},{r['CEFR']}" for r in src) or "（無）"
        tsl = raw_rows("TSL_12_stats.csv", "Word", w, "latin-1")
        ngsl = raw_rows("NGSL_12_stats.csv", "Lemma", w)
        flags = f"TSL#{tsl[0]['TSL Rank']}" if tsl else "TSL 無"
        flags += f"／NGSL#{ngsl[0]['SFI Rank']}" if ngsl else "／NGSL 無"
        r = ec.get(e["headword"])
        ec_txt = f"frq={r['frq']}／{r['translation'][:60]}" if r else "（無同形詞條）"
        lines.append(f"| {cell(json.dumps(e, ensure_ascii=False))} | {cell(src_txt)} | {flags} | {cell(ec_txt)} |")
    (DATA / "reports/sample30.md").write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")

    manifest = json.loads((DATA / "dict/manifest.json").read_text(encoding="utf-8"))
    pool = []
    for name in sorted(manifest["shards"].values()):
        shard = json.loads((DATA / "dict" / name).read_text(encoding="utf-8"))
        pool.extend(sorted(shard["e"].items()))
    picks = sorted(rnd.sample(pool, 50))
    ec = ecdict_raw({w for w, _ in picks})
    lines = [
        "# 字典釋義抽樣 50 條：ECDICT 簡體原文 vs 繁中輸出（seed 20261001）",
        "",
        "| 詞 | ECDICT 原文 | 輸出 |",
        "|---|---|---|",
    ]
    for w, (_ph, gloss) in picks:
        lines.append(f"| {cell(w)} | {cell(ec[w]['translation'])} | {cell(gloss)} |")
    (DATA / "reports/sample50-zh.md").write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
