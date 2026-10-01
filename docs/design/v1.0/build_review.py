"""組建 TASK-3 高保真審閱頁 review.html。

來源：
  review.src.html            畫面與頁面原始檔（{{i:名稱}}／{{i24:名稱}} 為圖示佔位）
  app/src/design/tokens.css  設計 tokens（原封內嵌，與 app 同一份）
  icons/*.svg                Lucide 圖示（lucide-static 1.49.0，ISC）
用法（repo 根目錄）：python docs/design/v1.0/build_review.py
"""
import pathlib
import re

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[2]

src = (HERE / "review.src.html").read_text(encoding="utf-8")
tokens = (ROOT / "app/src/design/tokens.css").read_text(encoding="utf-8")


def icon(match):
    size, name = match.group(1), match.group(2)
    svg = (HERE / "icons" / f"{name}.svg").read_text(encoding="utf-8")
    inner = re.search(r"<svg[^>]*>(.*)</svg>", svg, re.S).group(1)
    inner = re.sub(r"\s+", " ", inner).strip()
    cls = "ic ic-24" if size == "i24" else "ic"
    return (f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{inner}</svg>')


assert src.count("/*__TOKENS__*/") == 1
page = src.replace("/*__TOKENS__*/", tokens)
page, n_icons = re.subn(r"\{\{(i|i24):([a-z0-9-]+)\}\}", icon, page)
assert "{{" not in page, "有未替換的圖示佔位"

screens = re.findall(r'<article class="shot-row" id="(s\d\d)"', page)
states = re.findall(r'<div class="phone" data-state="([\w-]+)"', page)
assert screens == [f"s{i:02d}" for i in range(1, 15)], screens

(HERE / "review.html").write_text(page, encoding="utf-8", newline="\n")
print(f"review.html：{len(page)} bytes、畫面 {len(screens)}、狀態 {len(states)}、圖示 {n_icons}")
