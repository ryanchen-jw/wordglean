"""lexicon.json 的介面與內容（AC#2）。

期望值來源：原始 CSV 逐字列（見各測試註解）、TASK-7 介面約定；不經 build.py 的邏輯重算。
"""

import csv
from collections import Counter

from conftest import RAW, needs_raw

POS_ENUM = {"n", "v", "adj", "adv", "prep", "conj", "pron", "det", "num", "int", "aux", "part", None}
FIELDS = {"id", "headword", "pos", "cefr", "cefrSource", "toeic", "ngsl", "freqRank", "glossZh"}


def by_id(lexicon):
    return {e["id"]: e for e in lexicon}


def test_interface_shape(lexicon):
    for e in lexicon:
        assert set(e) == FIELDS, e
        assert e["pos"] in POS_ENUM
        assert e["cefr"] in {"A1", "A2", "B1", "B2", "C1", "C2", None}
        assert e["cefrSource"] in {"cefrj", "octanove", None}
        assert (e["cefr"] is None) == (e["cefrSource"] is None)
        assert isinstance(e["toeic"], bool) and isinstance(e["ngsl"], bool)
        assert e["freqRank"] is None or (isinstance(e["freqRank"], int) and e["freqRank"] > 0)
        assert e["glossZh"] is None or 0 < len(e["glossZh"]) <= 30
        assert e["id"] == f"{e['headword']}#{e['pos'] or 'unk'}"


def test_sorted_and_unique(lexicon):
    ids = [e["id"] for e in lexicon]
    assert ids == sorted(ids)
    assert len(ids) == len(set(ids))


def test_known_rows_from_source_csv(lexicon):
    lx = by_id(lexicon)
    # cefrj-vocabulary-profile-1.5.csv：abandon,verb,B1／abandoned,adjective,B2／a,determiner,A1
    assert (lx["abandon#v"]["cefr"], lx["abandon#v"]["cefrSource"]) == ("B1", "cefrj")
    assert lx["abandoned#adj"]["cefr"] == "B2"
    assert lx["a#det"]["cefr"] == "A1"
    # 'a.m./A.M./am/AM',adverb,A1 → 取第一個寫法
    assert lx["a.m.#adv"]["cefr"] == "A1"
    # March（三月）與 march（行軍）是不同詞
    assert lx["March#n"]["cefr"] == "A1" and lx["march#n"]["cefr"] == "B1"
    # octanove-vocabulary-profile-c1c2-1.0.csv：exterior,noun,C1／timid,adjective,C1／remonstrate,vern,C2（筆誤修正）
    assert (lx["exterior#n"]["cefr"], lx["exterior#n"]["cefrSource"]) == ("C1", "octanove")
    assert lx["timid#adj"]["cefr"] == "C1"
    assert lx["remonstrate#v"]["cefr"] == "C2"
    # TSL_12_stats.csv 前三名 mister, vacation, client；NGSL_12_stats.csv 前四名 the, be, and, of
    assert any(e["toeic"] for e in lexicon if e["headword"] == "vacation")
    assert any(e["toeic"] for e in lexicon if e["headword"] == "client")
    for w in ("the", "be", "and", "of"):
        assert any(e["ngsl"] for e in lexicon if e["headword"] == w), w


def test_tsl_only_word_kept_with_null_cefr(lexicon):
    # mister 只在 TSL、不在 CEFR-J／Octanove
    rows = [e for e in lexicon if e["headword"] == "mister"]
    assert rows and all(e["cefr"] is None and e["toeic"] for e in rows)


def test_multi_pos_one_row_each(lexicon):
    # cefrj：can,modal auxiliary,A1／can,noun,A2
    lx = by_id(lexicon)
    assert lx["can#aux"]["cefr"] == "A1"
    assert lx["can#n"]["cefr"] == "A2"


def test_gloss_follows_pos(lexicon):
    # ecdict.csv light：「a. 轻的, 少量的, 轻微的, …」「n. 光, 光亮, 灯, …」
    lx = by_id(lexicon)
    assert lx["light#adj"]["glossZh"] == "a. 輕的, 少量的⋯"
    assert lx["light#n"]["glossZh"] == "n. 光, 光亮⋯"


@needs_raw("cefrj-vocabulary-profile-1.5.csv")
def test_cefrj_level_counts_match_source(lexicon):
    with open(RAW / "cefrj-vocabulary-profile-1.5.csv", encoding="utf-8", newline="") as f:
        src = Counter(r["CEFR"] for r in csv.DictReader(f))
    got = Counter(e["cefr"] for e in lexicon if e["cefrSource"] == "cefrj")
    assert got == src
    assert src == {"A1": 1164, "A2": 1411, "B1": 2446, "B2": 2778}


@needs_raw("TSL_12_stats.csv")
def test_every_tsl_and_ngsl_word_flagged(lexicon):
    def col(name, column, enc):
        with open(RAW / name, encoding=enc, newline="") as f:
            return [r[column].strip() for r in csv.DictReader(f)]

    tsl = {w.lower() for w in col("TSL_12_stats.csv", "Word", "latin-1")}
    ngsl = {w.lower() for w in col("NGSL_12_stats.csv", "Lemma", "utf-8")}
    assert (len(tsl), len(ngsl)) == (1250, 2809)
    # CEFR 表的 'adviser/advisor' 寫法：非第一寫法 → 第一寫法
    alias = {}
    for name in ("cefrj-vocabulary-profile-1.5.csv", "octanove-vocabulary-profile-c1c2-1.0.csv"):
        for hw in col(name, "headword", "utf-8"):
            parts = [p.strip().lower() for p in hw.split("/")]
            for p in parts[1:]:
                alias.setdefault(p, parts[0])
    toeic_heads = {e["headword"].lower() for e in lexicon if e["toeic"]}
    ngsl_heads = {e["headword"].lower() for e in lexicon if e["ngsl"]}
    assert {alias.get(w, w) for w in tsl} <= toeic_heads
    assert {alias.get(w, w) for w in ngsl} <= ngsl_heads
