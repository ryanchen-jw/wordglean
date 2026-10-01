"""TASK-2 設計 R1／R1b：三個視覺方向的 WCAG 2.x 對比度實算。

用法：python docs/design/r1/contrast_check.py [r1|r1b]（預設 r1）
輸出 markdown 表（貼進 directions.md）；任一組未達門檻時以 exit code 1 結束。
門檻：一般文字 4.5（AA）；大字（≥24px 或 ≥18.66px 粗體）與 UI 元件邊界 3.0（AA）。
"""
import sys

# 色票唯一來源：directions.md 與 pick.html 的色碼都從這裡抄出
PALETTES = {
    "A 安靜書桌": {
        "light": {
            "bg": "#F6F1E7", "surface": "#FFFCF5", "text": "#1E2329", "muted": "#595E66",
            "border": "#8F8778", "primary": "#22467A", "on-primary": "#FFFFFF",
            "correct": "#2C6B3F", "correct-bg": "#E4F0E4",
            "error": "#A23A2C", "error-bg": "#F7E3DE",
            "hint": "#7D5700", "hint-bg": "#F6EBCF",
        },
        "dark": {
            "bg": "#1B1A17", "surface": "#25231F", "text": "#ECE6DA", "muted": "#ABA394",
            "border": "#7A7366", "primary": "#9DB8E3", "on-primary": "#14223A",
            "correct": "#8FCB9B", "error": "#F0A296", "hint": "#E3C075",
        },
    },
    "B 清爽工具": {
        "light": {
            "bg": "#FFFFFF", "surface": "#F3F5F7", "text": "#111827", "muted": "#4B5563",
            "border": "#77818F", "primary": "#0F6E66", "on-primary": "#FFFFFF",
            "correct": "#17703A", "correct-bg": "#E3F4E8",
            "error": "#B42020", "error-bg": "#FBE5E5",
            "hint": "#94520A", "hint-bg": "#FCEFD9",
        },
        "dark": {
            "bg": "#0F1216", "surface": "#1A1F25", "text": "#E6E9ED", "muted": "#A0A8B3",
            "border": "#6B7480", "primary": "#5FCFC2", "on-primary": "#062824",
            "correct": "#6FD18E", "error": "#FF9A9A", "hint": "#F2B866",
        },
    },
    "C 溫暖陪伴": {
        "light": {
            "bg": "#FFF6EC", "surface": "#FFFFFF", "text": "#2B2119", "muted": "#6A584A",
            "border": "#A08A78", "primary": "#B2431D", "on-primary": "#FFFFFF",
            "correct": "#2B7149", "correct-bg": "#E2F2E6",
            "error": "#B0261A", "error-bg": "#FCE4DF",
            "hint": "#835600", "hint-bg": "#FBEBC8",
        },
        "dark": {
            "bg": "#1E1814", "surface": "#2A221C", "text": "#F3E9DF", "muted": "#B9A898",
            "border": "#85735F", "primary": "#FFA27F", "on-primary": "#3A1405",
            "correct": "#8DD3A6", "error": "#FFA294", "hint": "#EDC273",
        },
    },
}

# (前景, 背景, 門檻, 用途說明)
LIGHT_PAIRS = [
    ("text", "bg", 4.5, "內文／底色"),
    ("text", "surface", 4.5, "內文／卡片"),
    ("muted", "bg", 4.5, "次要文字／底色"),
    ("muted", "surface", 4.5, "次要文字／卡片"),
    ("primary", "surface", 4.5, "主色文字連結／卡片"),
    ("on-primary", "primary", 4.5, "主按鈕文字／主色"),
    ("border", "surface", 3.0, "輸入框邊線／卡片"),
    ("correct", "correct-bg", 4.5, "答對文字／答對底"),
    ("error", "error-bg", 4.5, "答錯文字／答錯底"),
    ("hint", "hint-bg", 4.5, "提示文字／提示底"),
    ("correct", "surface", 4.5, "答對文字／卡片"),
    ("error", "surface", 4.5, "答錯文字／卡片"),
]
DARK_PAIRS = [
    ("text", "bg", 4.5, "內文／底色"),
    ("text", "surface", 4.5, "內文／卡片"),
    ("muted", "surface", 4.5, "次要文字／卡片"),
    ("primary", "surface", 4.5, "主色文字連結／卡片"),
    ("on-primary", "primary", 4.5, "主按鈕文字／主色"),
    ("border", "surface", 3.0, "輸入框邊線／卡片"),
    ("correct", "surface", 4.5, "答對文字／卡片"),
    ("error", "surface", 4.5, "答錯文字／卡片"),
    ("hint", "surface", 4.5, "提示文字／卡片"),
]

# R1b：依 ui-ux-pro-max 查詢重做的三方向（docs/design/r1b/directions.md、pick.html 的色碼唯一來源）
PALETTES_R1B = {
    "1 Swiss 專注": {
        "light": {
            "bg": "#FAF8FD", "surface": "#FFFFFF", "text": "#0F172A", "muted": "#475569",
            "border": "#7C8091", "primary": "#7C3AED", "on-primary": "#FFFFFF", "accent": "#5B21B6",
            "correct": "#047857", "correct-bg": "#E6F4EE",
            "error": "#B91C1C", "error-bg": "#FCEAEA",
            "hint": "#8A4B0B", "hint-bg": "#FBF0DF",
        },
        "dark": {
            "bg": "#0D0B12", "surface": "#17141F", "text": "#EDEBF3", "muted": "#A7A3B6",
            "border": "#6C6681", "primary": "#B9A2FF", "on-primary": "#1A0B3B", "accent": "#D4C6FF",
            "correct": "#5ED3A2", "correct-bg": "#10291E",
            "error": "#FF9E9E", "error-bg": "#33171A",
            "hint": "#F2C26E", "hint-bg": "#2D2312",
        },
    },
    "2 柔光層次": {
        "light": {
            "bg": "#F5F3FA", "surface": "#FFFFFF", "text": "#1C1A27", "muted": "#57536A",
            "border": "#8C88A0", "primary": "#047857", "on-primary": "#FFFFFF", "accent": "#6E56CF",
            "correct": "#0B6B4A", "correct-bg": "#E3F3EA",
            "error": "#B42318", "error-bg": "#FBE7E4",
            "hint": "#7A4E00", "hint-bg": "#F6ECD5",
        },
        "dark": {
            "bg": "#121118", "surface": "#1C1A24", "text": "#ECEAF4", "muted": "#A9A5BA",
            "border": "#6D687E", "primary": "#6EDBAE", "on-primary": "#05271B", "accent": "#B9A8F5",
            "correct": "#7FE0B4", "correct-bg": "#11291F",
            "error": "#FFA39A", "error-bg": "#34191A",
            "hint": "#EFC777", "hint-bg": "#2C2414",
        },
    },
    "3 暖橘模組": {
        "light": {
            "bg": "#EEF1FF", "surface": "#FFFFFF", "text": "#1E1B4B", "muted": "#4A4F6A",
            "border": "#7F86B0", "primary": "#C2410C", "on-primary": "#FFFFFF", "accent": "#4F46E5",
            "correct": "#116B34", "correct-bg": "#E5F5EA",
            "error": "#B91C1C", "error-bg": "#FDECEC",
            "hint": "#8A4B0B", "hint-bg": "#FBF0DF",
        },
        "dark": {
            "bg": "#10101E", "surface": "#1A1A2E", "text": "#ECEDFB", "muted": "#A9ACC8",
            "border": "#6B6F96", "primary": "#FF9259", "on-primary": "#3A1300", "accent": "#A5A8FF",
            "correct": "#6FD69A", "correct-bg": "#12291C",
            "error": "#FF9E9E", "error-bg": "#33171A",
            "hint": "#F2C26E", "hint-bg": "#2D2312",
        },
    },
}
_EXTRA = [
    ("accent", "surface", 4.5, "輔色文字（標籤、連結）／卡片"),
    ("primary", "bg", 3.0, "主色非文字元件（進度條、選取框）／底色"),
]
LIGHT_PAIRS_R1B = LIGHT_PAIRS + _EXTRA
# R1 深色只驗了回饋文字對卡片；R1b 補驗回饋文字對回饋底（深色答題回饋條）
DARK_PAIRS_R1B = DARK_PAIRS + [
    ("correct", "correct-bg", 4.5, "答對文字／答對底"),
    ("error", "error-bg", 4.5, "答錯文字／答錯底"),
    ("hint", "hint-bg", 4.5, "提示文字／提示底"),
] + _EXTRA

SETS = {
    "r1": (PALETTES, LIGHT_PAIRS, DARK_PAIRS),
    "r1b": (PALETTES_R1B, LIGHT_PAIRS_R1B, DARK_PAIRS_R1B),
}


def luminance(hex_color):
    h = hex_color.lstrip("#")
    channels = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def ratio(fg, bg):
    hi, lo = sorted((luminance(fg), luminance(bg)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)


def main(argv):
    palettes, light_pairs, dark_pairs = SETS[argv[1] if len(argv) > 1 else "r1"]
    failures = 0
    print("| 方向 | 模式 | 組合 | 前景 | 背景 | 對比 | 門檻 | 判定 |")
    print("|---|---|---|---|---|---|---|---|")
    for name, modes in palettes.items():
        for mode, pairs in (("淺色", light_pairs), ("深色", dark_pairs)):
            pal = modes["light" if mode == "淺色" else "dark"]
            for fg, bg, need, label in pairs:
                r = ratio(pal[fg], pal[bg])
                ok = r >= need
                failures += not ok
                print(f"| {name} | {mode} | {label} | `{pal[fg]}` | `{pal[bg]}` | {r:.2f} | {need} | {'✅ AA' if ok else '❌'} |")
    print(f"\n未達門檻：{failures} 組")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
