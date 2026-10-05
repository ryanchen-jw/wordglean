"""片語表 phrases/phrases.json（TASK-24，本專案自編、CC BY-SA 4.0）。

結構看 phrases.schema.json；語意規則：
- 依 phrase 排序、不重複；不與 lexicon 已有的多字詞重複。
- components 依序對應片語的每個字：字本身，或 ECDICT 詞形表（dict 切片 f 欄）的原形。
- 組成字都要在 A1–C1 課綱（lexicon 有級距且不是只有 C2）。
- 級距 ≥ 組成字最高級距（學到片語時組成字都已教過）；只有人工下調的片語（downgradedFrom）例外，
  且 downgradedFrom 必須等於組成字最高級距。
"""

import json

import jsonschema
import pytest

from conftest import DATA, load_json

ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"]

# 創辦人裁示（2026-10-05）允許的人工下調：只限生活常用片語；理由見 docs TASK-24 plan.md
DOWNGRADES = {"do the laundry": ("B2", "A2"), "hang out": ("B1", "A2")}


@pytest.fixture(scope="module")
def phrases():
    doc = load_json("phrases/phrases.json")
    jsonschema.validate(doc, json.loads((DATA / "phrases/phrases.schema.json").read_text(encoding="utf-8")))
    return doc["phrases"]


@pytest.fixture(scope="module")
def word_levels(lexicon):
    levels = {}
    for e in lexicon:
        if e["cefr"] in ORDER:
            w = e["headword"].strip().lower()
            if w not in levels or ORDER.index(e["cefr"]) < ORDER.index(levels[w]):
                levels[w] = e["cefr"]
    return levels


@pytest.fixture(scope="module")
def forms(shards):
    out = {}
    for s in shards.values():
        out.update(s["f"])
    return out


def test_sorted_unique_and_counts(phrases):
    names = [p["phrase"] for p in phrases]
    assert names == sorted(names)
    assert len(names) == len(set(names))
    counts = {lv: sum(p["cefr"] == lv for p in phrases) for lv in ORDER}
    assert counts == {"A1": 0, "A2": 104, "B1": 138, "B2": 151, "C1": 75, "C2": 0}
    assert sum(p["type"] == "pv" for p in phrases) == 302


def test_not_already_in_lexicon(phrases, word_levels, lexicon):
    headwords = {e["headword"].strip().lower() for e in lexicon}
    assert [p["phrase"] for p in phrases if p["phrase"] in headwords] == []


def test_components_match_phrase_words(phrases, forms):
    for p in phrases:
        tokens = p["phrase"].split(" ")
        assert len(tokens) == len(p["components"]), p["phrase"]
        for tok, comp in zip(tokens, p["components"]):
            assert comp == tok or comp in forms.get(tok, []), (p["phrase"], tok, comp)


def test_level_not_below_components_except_downgrades(phrases, word_levels):
    downgraded = {}
    for p in phrases:
        levels = [word_levels.get(c) for c in p["components"]]
        assert all(lv in ORDER[:5] for lv in levels), (p["phrase"], p["components"], levels)
        top = max(levels, key=ORDER.index)
        if "downgradedFrom" in p:
            assert p["downgradedFrom"] == top and ORDER.index(p["cefr"]) < ORDER.index(top), p["phrase"]
            downgraded[p["phrase"]] = (p["downgradedFrom"], p["cefr"])
        else:
            assert ORDER.index(p["cefr"]) >= ORDER.index(top), (p["phrase"], p["cefr"], top)
    assert downgraded == DOWNGRADES
