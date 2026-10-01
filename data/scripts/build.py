"""由 data/raw/ 的鎖版來源產生 data/ 下的衍生檔（先跑 fetch.py）。

產出（皆位元組可重現）：
  sources/cefrj/levels.json      CEFR-J 條款
  sources/octanove/levels.json   CC BY-SA 4.0
  sources/ngsl-tsl/flags.json    CC BY-SA 4.0
  lexicon/lexicon.json           建置時合併（TASK-7 介面）
  dict/manifest.json、dict/*.json ECDICT 衍生字典切片（MIT）
  reports/stats.json             統計

用法：python data/scripts/build.py [--out DIR]（預設輸出到 data/）
"""

import argparse
import csv
import gzip
import json
import re
import shutil
from collections import defaultdict
from pathlib import Path

from lexlib import FIXUPS, to_tw, truncate_gloss

DATA = Path(__file__).resolve().parent.parent
RAW = DATA / "raw"

LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

# 來源詞性 → 統一列舉
SOURCE_POS = {
    "noun": "n", "verb": "v", "adjective": "adj", "adverb": "adv",
    "preposition": "prep", "conjunction": "conj", "pronoun": "pron",
    "determiner": "det", "number": "num", "interjection": "int",
    "modal auxiliary": "aux", "be-verb": "v", "do-verb": "v", "have-verb": "v",
    "infinitive-to": "part",
}
# Octanove 原表筆誤的人工修正（見 data/CLAUDE.md）
OCTANOVE_POS_FIX = {("remonstrate", "vern"): "verb", ("batter", ""): "noun"}

# ECDICT 釋義行首詞性 → 統一列舉
ECDICT_POS = {
    "n.": "n", "v.": "v", "vt.": "v", "vi.": "v", "vbl.": "v",
    "a.": "adj", "adj.": "adj", "adv.": "adv", "ad.": "adv",
    "prep.": "prep", "conj.": "conj", "pron.": "pron", "num.": "num",
    "int.": "int", "interj.": "int", "aux.": "aux", "art.": "det", "pl.": "n",
}
# 中文字典慣把限定詞標成形容詞（如 all：a. 所有的）
GLOSS_POS_FALLBACK = {"det": "adj"}
_LINE_POS = re.compile(r"^([a-z]+\.)")

SHARD_GZIP_LIMIT = 200 * 1024
SHARD_GZIP_TARGET = 180 * 1024  # 留餘裕給不同 gzip 實作


def dump(obj):
    return json.dumps(obj, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def write_text(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)


def write_rows(path, rows):
    """一筆一行的 JSON 陣列（diff 友善）。"""
    write_text(path, "[\n" + ",\n".join(dump(r) for r in rows) + "\n]\n")


def read_csv(name, encoding="utf-8"):
    with open(RAW / name, encoding=encoding, newline="") as f:
        return list(csv.DictReader(f))


def variants(headword):
    """'adviser/advisor' → ['adviser', 'advisor']（小寫）。"""
    return [v.strip().lower() for v in headword.split("/") if v.strip()]


# ---------- 來源 ----------

def load_levels(name, pos_fix=None):
    """CEFR 級距表 → {(headword, pos): level}；同一 (詞, 詞性) 重複時取較低級。"""
    out = {}
    for r in read_csv(name):
        hw = r["headword"].strip()
        src_pos = (pos_fix or {}).get((hw, r["pos"]), r["pos"])
        key = (hw, SOURCE_POS[src_pos])
        lv = r["CEFR"].strip()
        if key not in out or LEVELS.index(lv) < LEVELS.index(out[key]):
            out[key] = lv
    return out


def level_rows(levels):
    return [{"headword": hw, "pos": pos, "cefr": lv} for (hw, pos), lv in sorted(levels.items())]


def load_wordlist(name, column, encoding):
    return sorted({r[column].strip().lower() for r in read_csv(name, encoding) if r[column].strip()})


# ---------- ECDICT ----------

def load_ecdict():
    """→ {word: {"phonetic", "lines"(繁中), "frq", "bnc", "exchange"}}；只讀需要的欄位。"""
    csv.field_size_limit(1 << 30)
    out = {}
    with open(RAW / "ecdict.csv", encoding="utf-8", newline="") as f:
        for r in csv.DictReader(f):
            word = r["word"].strip()
            trans = r["translation"].strip()
            if not word or not trans:
                continue
            lines = [ln.strip() for ln in trans.split("\\n") if ln.strip()]
            # [网络] 為網路釋義，只在沒有其他釋義時保留
            main = [ln for ln in lines if not ln.startswith("[网络]")]
            lines = main or lines
            src = "\n".join(lines)
            out[word] = {
                "phonetic": r["phonetic"].strip(),
                "fixups": [s for s, _d in FIXUPS if s in src],  # 統計用：命中的繁中修正（簡體原詞）
                "lines": [to_tw(ln) for ln in lines],
                "frq": int(r["frq"] or 0),
                "bnc": int(r["bnc"] or 0),
                "exchange": r["exchange"].strip(),
            }
    return out


def ecdict_get(ec, headword, ec_lower):
    for v in [headword.split("/")[0].strip()] + variants(headword):
        if v in ec:
            return ec[v]
    for v in variants(headword):
        if v in ec_lower:
            return ec[ec_lower[v]]
    return None


def line_pos(line):
    m = _LINE_POS.match(line)
    return ECDICT_POS.get(m.group(1)) if m else None


def gloss_for_pos(entry, pos):
    """該詞性的第一行釋義；沒有時退用替代詞性，再退用唯一一行無標記釋義（片語常見）。"""
    if entry is None:
        return None
    for p in (pos, GLOSS_POS_FALLBACK.get(pos)):
        lines = [ln for ln in entry["lines"] if p and line_pos(ln) == p]
        if lines:
            return truncate_gloss(lines[:1], max_senses=2, max_chars=30)
    plain = [ln for ln in entry["lines"] if not _LINE_POS.match(ln) and not ln.startswith("[")]
    if len(entry["lines"]) == 1 and plain:
        return truncate_gloss(plain, max_senses=2, max_chars=30)
    return None


def first_pos(entry):
    for ln in entry["lines"] if entry else []:
        p = line_pos(ln)
        if p:
            return p
    return None


def forms_of(exchange):
    """exchange 'p:lit/d:lit/s:lights' → 變化形清單（不含 0:/1: 這類指向原形的項目）。"""
    out = []
    for item in exchange.split("/"):
        k, _, v = item.partition(":")
        if v and k not in ("0", "1"):
            out.append(v)
    return out


# ---------- lexicon ----------

def build_lexicon(cefrj, octanove, tsl, ngsl, ec):
    tsl_set, ngsl_set = set(tsl), set(ngsl)
    ec_lower = {}
    for w in sorted(ec):
        ec_lower.setdefault(w.lower(), w)
    entries = {}

    def add(hw, pos, cefr, source):
        primary = hw.split("/")[0].strip()
        eid = f"{primary}#{pos or 'unk'}"  # 保留大小寫：March（三月）與 march（行軍）是不同詞
        if eid in entries:
            return
        e = ecdict_get(ec, hw, ec_lower)
        vs = variants(hw)
        entries[eid] = {
            "id": eid,
            "headword": primary,
            "pos": pos,
            "cefr": cefr,
            "cefrSource": source,
            "toeic": any(v in tsl_set for v in vs),
            "ngsl": any(v in ngsl_set for v in vs),
            "freqRank": (e["frq"] or None) if e else None,
            "glossZh": gloss_for_pos(e, pos),
        }

    for (hw, pos), lv in sorted(cefrj.items()):
        add(hw, pos, lv, "cefrj")
    for (hw, pos), lv in sorted(octanove.items()):
        add(hw, pos, lv, "octanove")  # 與 CEFR-J 重複的 (詞, 詞性) 以 CEFR-J 為準

    covered = {v for (hw, _p) in list(cefrj) + list(octanove) for v in variants(hw)}
    for word in sorted(tsl_set | ngsl_set):
        if word in covered:
            continue
        add(word, first_pos(ec.get(word)), None, None)
    return [entries[k] for k in sorted(entries)]


# ---------- dict 切片 ----------

def shard_key(word, n):
    k = ""
    for ch in word.lower()[:n]:
        k += ch if "a" <= ch <= "z" else "_"
    return k.ljust(n, "_")


def build_dict(ec, lexicon_words):
    """Q1 篩選：不含空格，且（有詞頻 或 在 exchange 詞形關係中 或 在 lexicon）。"""
    in_exchange = set()
    for w, e in ec.items():
        if e["exchange"]:
            in_exchange.add(w)
            in_exchange.update(forms_of(e["exchange"]))
    keep = {
        w: e for w, e in ec.items()
        if " " not in w and (e["frq"] or e["bnc"] or w in in_exchange or w.lower() in lexicon_words)
    }
    entries = {w: [e["phonetic"], truncate_gloss(e["lines"])] for w, e in keep.items()}
    fixup_hits = {s: sum(1 for e in keep.values() if s in e["fixups"]) for s, _d in FIXUPS}

    forms = {}
    for w, e in keep.items():
        for f in forms_of(e["exchange"]):
            if " " not in f and f != w:
                forms.setdefault(f, set()).add(w)
    forms = {f: sorted(ws) for f, ws in forms.items()}

    def pack(prefix_len, words, fwords):
        groups = defaultdict(lambda: ({}, {}))
        for w in words:
            groups[shard_key(w, prefix_len)][0][w] = entries[w]
        for f in fwords:
            groups[shard_key(f, prefix_len)][1][f] = forms[f]
        return groups

    shards = {}
    pending = [("", sorted(entries), sorted(forms))]
    while pending:
        parent, words, fwords = pending.pop()
        n = len(parent) + 1 if parent else 2
        for key, (es, fs) in sorted(pack(n, words, fwords).items()):
            body = dump({"e": es, "f": fs})
            if len(gzip.compress(body.encode("utf-8"), 9, mtime=0)) > SHARD_GZIP_TARGET and n < 6:
                pending.append((key, sorted(es), sorted(fs)))
            else:
                shards[key] = body
    return shards, len(entries), len(forms), fixup_hits


# ---------- main ----------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", type=Path, default=DATA)
    out = ap.parse_args().out

    cefrj = load_levels("cefrj-vocabulary-profile-1.5.csv")
    octanove = load_levels("octanove-vocabulary-profile-c1c2-1.0.csv", OCTANOVE_POS_FIX)
    tsl = load_wordlist("TSL_12_stats.csv", "Word", "latin-1")
    ngsl = load_wordlist("NGSL_12_stats.csv", "Lemma", "utf-8")
    ec = load_ecdict()

    write_rows(out / "sources/cefrj/levels.json", level_rows(cefrj))
    write_rows(out / "sources/octanove/levels.json", level_rows(octanove))
    write_text(out / "sources/ngsl-tsl/flags.json", dump({"ngsl": ngsl, "tsl": tsl}) + "\n")

    lexicon = build_lexicon(cefrj, octanove, tsl, ngsl, ec)
    write_rows(out / "lexicon/lexicon.json", lexicon)

    shards, n_entries, n_forms, fixup_hits = build_dict(ec, {e["headword"].lower() for e in lexicon})
    dict_dir = out / "dict"
    if dict_dir.exists():
        shutil.rmtree(dict_dir)
    manifest = {"prefixLengths": sorted({len(k) for k in shards}), "shards": {}}
    sizes = {}
    for key, body in shards.items():
        name = f"{key}.json"
        write_text(dict_dir / name, body)
        manifest["shards"][key] = name
        sizes[name] = (len(body.encode("utf-8")), len(gzip.compress(body.encode("utf-8"), 9, mtime=0)))
    write_text(dict_dir / "manifest.json", dump(manifest) + "\n")

    by_level = {lv: sum(1 for e in lexicon if e["cefr"] == lv) for lv in LEVELS}
    stats = {
        "lexicon": {
            "entries": len(lexicon),
            "headwords": len({e["headword"].lower() for e in lexicon}),
            "byCefr": by_level,
            "cefrNull": sum(1 for e in lexicon if e["cefr"] is None),
            "bySource": {s: sum(1 for e in lexicon if e["cefrSource"] == s) for s in ("cefrj", "octanove")},
            "toeicEntries": sum(1 for e in lexicon if e["toeic"]),
            "toeicHeadwords": len({e["headword"].lower() for e in lexicon if e["toeic"]}),
            "ngslEntries": sum(1 for e in lexicon if e["ngsl"]),
            "ngslHeadwords": len({e["headword"].lower() for e in lexicon if e["ngsl"]}),
            "posNull": sum(1 for e in lexicon if e["pos"] is None),
            "glossNull": sum(1 for e in lexicon if e["glossZh"] is None),
            "freqRankNull": sum(1 for e in lexicon if e["freqRank"] is None),
        },
        "sources": {
            "cefrjPairs": len(cefrj), "octanovePairs": len(octanove),
            "octanoveOverlapCefrj": len(set(octanove) & set(cefrj)),
            "tsl": len(tsl), "ngsl": len(ngsl), "ecdictRowsWithTranslation": len(ec),
        },
        "dict": {
            "entries": n_entries, "forms": n_forms, "shards": len(shards),
            "totalBytes": sum(s[0] for s in sizes.values()),
            "totalGzipBytes": sum(s[1] for s in sizes.values()),
            "maxGzipBytes": max(s[1] for s in sizes.values()),
            "maxGzipShard": max(sizes, key=lambda k: sizes[k][1]),
            "zhFixupEntries": fixup_hits,
        },
    }
    write_text(out / "reports/stats.json", json.dumps(stats, ensure_ascii=False, indent=2, sort_keys=True) + "\n")
    print(json.dumps(stats, ensure_ascii=False, indent=2))
    assert stats["dict"]["maxGzipBytes"] <= SHARD_GZIP_LIMIT, "有切片超過 200KB gzip"


if __name__ == "__main__":
    main()
