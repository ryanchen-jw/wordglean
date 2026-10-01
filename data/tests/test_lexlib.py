"""lexlib 純函式測試；期望值為手寫字面值（OpenCC s2twp 的台灣慣用詞為已知對照）。"""

from lexlib import to_tw, truncate_gloss


def test_to_tw_characters_and_taiwan_phrases():
    assert to_tw("光亮, 灯") == "光亮, 燈"
    assert to_tw("软件") == "軟體"
    assert to_tw("鼠标") == "滑鼠"
    assert to_tw("网络") == "網路"


def test_zh_fixups_correct_s2twp_misconversions():
    assert to_tw("(big的最高级)") == "(big的最高級)"
    assert to_tw("n. 血液循环, 循环小数") == "n. 血液循環, 循環小數"
    assert to_tw("vi. 互相影响, 交互作用") == "vi. 互相影響, 交互作用"
    assert to_tw("n. 盘问；交互讯问") == "n. 盤問；交互訊問"
    assert to_tw("n. 崇拜的对象, 调查对象") == "n. 崇拜的對象, 調查對象"
    assert to_tw("以多层次人们为对象的") == "以多層次人們為對象的"


def test_zh_fixups_keep_programming_terms():
    # 程式用語本來就該用台灣資訊術語，不在修正表內
    assert to_tw("[计] 当型循环") == "[計] 當型迴圈"
    assert to_tw("[计] 对象") == "[計] 物件"
    assert to_tw("面向对象设计") == "物件導向設計"
    # 語境不確定（交替義／互動義並存）刻意不修
    assert to_tw("a. 交互的") == "a. 互動的"


def test_zh_fixups_leave_no_placeholder():
    out = to_tw("最高级循环的对象")
    assert out == "最高級循環的對象"
    assert not any("" <= ch <= "" for ch in out)


def test_truncate_keeps_three_senses_per_line():
    assert truncate_gloss(["n. 甲, 乙, 丙, 丁"]) == "n. 甲, 乙, 丙⋯"
    assert truncate_gloss(["vt. 甲；乙"]) == "vt. 甲, 乙"


def test_truncate_line_without_pos_prefix():
    assert truncate_gloss(["go的過去式"]) == "go的過去式"


def test_truncate_total_length():
    out = truncate_gloss(["n. " + "字" * 200])
    assert len(out) == 160
    assert out.endswith("⋯")


def test_truncate_custom_limits_for_lexicon_gloss():
    assert truncate_gloss(["n. 甲, 乙, 丙"], max_senses=2, max_chars=30) == "n. 甲, 乙⋯"
