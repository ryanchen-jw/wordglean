"""守衛（AC#6）：lexicon、字典切片、來源衍生檔不得含 Oxford 3000 衍生欄位或同等資訊。

做法：欄位白名單＋黑名單。任何新增欄位（不論名稱）都會讓白名單測試變紅，
迫使新增者在此明確審查是否帶入 ECDICT 的 oxford／collins／tag 資訊。
"""

import json

from conftest import DATA, load_json

BANNED = ("oxford", "collins", "tag", "ox3000", "oxf")

LEXICON_FIELDS = {"id", "headword", "pos", "cefr", "cefrSource", "toeic", "ngsl", "freqRank", "glossZh"}
LEVEL_FIELDS = {"headword", "pos", "cefr"}


def all_keys(obj):
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield k
            yield from all_keys(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from all_keys(v)


def data_files():
    for sub in ("lexicon", "dict", "sources"):
        yield from sorted((DATA / sub).rglob("*.json"))


def test_no_banned_key_names_anywhere():
    for path in data_files():
        keys = {k.lower() for k in all_keys(json.loads(path.read_text(encoding="utf-8")))}
        if path.parent.name == "dict" and path.name != "manifest.json":
            continue  # 切片的鍵是英文詞條本身（如 "tag"、"Oxford"），由下方結構測試把關
        assert not [k for k in keys if any(b in k for b in BANNED)], path


def test_lexicon_fields_whitelist(lexicon):
    for e in lexicon:
        assert set(e) == LEXICON_FIELDS, e


def test_source_level_files_whitelist():
    for rel in ("sources/cefrj/levels.json", "sources/octanove/levels.json"):
        for row in load_json(rel):
            assert set(row) == LEVEL_FIELDS, (rel, row)
    assert set(load_json("sources/ngsl-tsl/flags.json")) == {"ngsl", "tsl"}


def test_dict_shard_structure(manifest, shards):
    assert set(manifest) == {"prefixLengths", "shards"}
    for name, s in shards.items():
        assert set(s) == {"e", "f"}, name
        for w, val in s["e"].items():
            # 只有 [音標, 釋義] 兩個字串，沒有任何額外旗標或星級
            assert isinstance(val, list) and len(val) == 2 and all(isinstance(x, str) for x in val), (name, w)
        for f, lemmas in s["f"].items():
            assert isinstance(lemmas, list) and all(isinstance(x, str) for x in lemmas), (name, f)
