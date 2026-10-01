"""字典切片（AC#4 大小、TASK-16 查義介面）。期望值取自 ecdict.csv 原文手算。"""

import gzip
import json

from conftest import DATA

LIMIT = 200 * 1024


def shard_key(word, n):
    """切片鍵：前 n 個字母小寫，非 a–z 記為 _，不足補 _（data/CLAUDE.md 的查找規則）。"""
    k = "".join(c if "a" <= c <= "z" else "_" for c in word.lower()[:n])
    return k.ljust(n, "_")


def lookup(word, manifest, shards):
    for n in sorted(manifest["prefixLengths"], reverse=True):
        k = shard_key(word, n)
        if k in manifest["shards"]:
            return shards[manifest["shards"][k]]
    raise KeyError(word)


def test_every_shard_under_200kb_gzip(manifest):
    for name in manifest["shards"].values():
        raw = (DATA / "dict" / name).read_bytes()
        assert len(gzip.compress(raw, 9)) <= LIMIT, name


def test_manifest_lists_exactly_the_files(manifest):
    on_disk = {p.name for p in (DATA / "dict").glob("*.json")} - {"manifest.json"}
    assert on_disk == set(manifest["shards"].values())


def test_light_entry(manifest, shards):
    # ecdict.csv：light,lait,…,"n. 光, 光亮, 灯, 日光, …\na. 轻的, 少量的, 轻微的, …\nvt. 点燃, 照亮\nvi. 点着, 变亮, 突降, 偶然碰到\nadv. 轻地"
    phonetic, gloss = lookup("light", manifest, shards)["e"]["light"]
    assert phonetic == "lait"
    lines = gloss.split("\n")
    assert lines[0] == "n. 光, 光亮, 燈⋯"
    assert lines[1] == "a. 輕的, 少量的, 輕微的⋯"
    assert lines[2] == "vt. 點燃, 照亮"
    assert lines[4] == "adv. 輕地"
    assert len(gloss) <= 160


def test_inflected_forms_point_to_lemma(manifest, shards):
    # ecdict.csv：light 的 exchange 含 p:lit／go 的 exchange 含 p:went
    assert "light" in lookup("lit", manifest, shards)["f"]["lit"]
    assert lookup("went", manifest, shards)["f"]["went"] == ["go"]
    assert "perceive" in lookup("perceived", manifest, shards)["f"]["perceived"]


def test_no_phrases_and_filter_applied(manifest, shards):
    total = 0
    for s in shards.values():
        for w in s["e"]:
            assert " " not in w
            total += 1
    # 規格 Q1：篩選後遠少於 ECDICT 全量 77 萬
    assert 50_000 < total < 300_000


def test_short_and_symbol_words_resolve(manifest, shards):
    assert "a" in lookup("a", manifest, shards)["e"]
    assert "e-mail" in lookup("e-mail", manifest, shards)["e"] or "email" in lookup("email", manifest, shards)["e"]


def test_shards_are_valid_json_objects(shards):
    for s in shards.values():
        assert set(s) == {"e", "f"}
        json.dumps(s)
