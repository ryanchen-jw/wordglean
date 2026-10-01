"""單字資料管線的純函式（受測 seam）。"""

import re
from pathlib import Path

import opencc

_s2twp = opencc.OpenCC("s2twp")


def _load_fixups():
    """zh_fixups.tsv：簡體原詞 → 正確繁中；長詞優先比對。"""
    rows = Path(__file__).with_name("zh_fixups.tsv").read_text(encoding="utf-8").splitlines()[1:]
    pairs = [tuple(r.split("\t")[:2]) for r in rows if r.strip()]
    return sorted(pairs, key=lambda p: -len(p[0]))


FIXUPS = _load_fixups()

# 義項分隔：中文頓號以外的逗號、分號
_SENSE_SPLIT = re.compile(r"\s*[,，;；]\s*")
_POS_PREFIX = re.compile(r"^([a-z]+\.)\s*")


def to_tw(text):
    """簡體中文 → 台灣正體（含台灣慣用詞），OpenCC s2twp；zh_fixups.tsv 所列詞先以佔位字元保護、轉換後換成正確詞。"""
    for i, (src, _dst) in enumerate(FIXUPS):
        text = text.replace(src, f"{chr(0xE100 + i)}")
    text = _s2twp.convert(text)
    for i, (_src, dst) in enumerate(FIXUPS):
        text = text.replace(f"{chr(0xE100 + i)}", dst)
    return text


def truncate_gloss(lines, max_senses=3, max_chars=160):
    """截斷字典釋義。

    lines：已分行的釋義（每行通常以詞性開頭，如 "n. 光, 光亮"）。
    每行只留前 max_senses 個義項（以逗號／分號切），多的以「⋯」標示；
    全部行以 "\\n" 串接後超過 max_chars 字時，截到 max_chars-1 字並補「⋯」。
    """
    out = []
    for line in lines:
        m = _POS_PREFIX.match(line)
        prefix = m.group(0) if m else ""
        senses = [s for s in _SENSE_SPLIT.split(line[len(prefix):]) if s]
        text = ", ".join(senses[:max_senses])
        if len(senses) > max_senses:
            text += "⋯"
        out.append(prefix + text)
    joined = "\n".join(out)
    if len(joined) > max_chars:
        joined = joined[: max_chars - 1] + "⋯"
    return joined
