# CEFR-J Wordlist — 使用條款一手原文

本檔逐字摘錄條款原文（2026-10-01 以 curl 直接抓取），非轉述。本卡使用的是 olp repo 的 Version 1.5（`cefrj-vocabulary-profile-1.5.csv`）；官網目前提供 1.6，需填表才能下載。

## 來源一：Open Language Profiles repo README（取得 1.5 版的實際出處）

- URL：https://github.com/openlanguageprofiles/olp-en-cefrj/blob/d4e45b75b38f27b30dfc5c44d8c571aec7e7092f/README.md
- commit：d4e45b75b38f27b30dfc5c44d8c571aec7e7092f（2020-03-25）

> ## Terms of use
>
> CEFR-J vocabulary and grammar profile datasets can be used for research and commercial purposes with no charge, provided that you cite the dataset properly. The copyright belongs to Tono Laboratory at TUFS (Tokyo University of Foreign Studies). Neither CEFR-J nor Open Language Profiles is responsible or liable for any inaccuracies in the dataset or any damage resulting from using the dataset.
>
> ## References
>
> * The CEFR-J Wordlist Version 1.5. Compiled by Yukio Tono, Tokyo University of Foreign Studies. Retrieved from http://www.cefr-j.org/download.html on 1/20/2020.

## 來源二：CEFR-J 官網下載頁（條款適用於 Version 1.6 頁面）

- URL：http://www.cefr-j.org/download.html（2026-10-01 取得）

日文原文：

> なお、本語彙表の著作権は東京外国語大学投野研究室に帰属するが、適切な引用を行っていただければ研究教育および商用においても無償で利用できる。 引用の仕方 『CEFR-J Wordlist Version 1.6』 東京外国語大学投野由紀夫研究室. （URL: XXX より◎年◎月ダウンロード） 免責事項 1)本語彙表は無償で公開する物であり、本語彙表の使用により生じた一切の損害・不利益・批判などに対して、科研チームおよび投野研究室は一切の責任を負わない。 2)商用利用に関しては、監修などを行う場合には別途相談の上、必要な経費を請求する。 3)語彙表は不完全な部分があり、内容的に誤りがある可能性は否定できないので、随時改訂版を作成するものを利用されたい。 4)本語彙表を改変して別の語彙表を作ることはかまわないが、必ず本語彙表を適切に引用しなければならない。

英文原文：

> The copyright of this wordlist belongs to Tono Laboratory at TUFS, but the list can be used for both research and commercial purposes with a proper acknowledgement of the source. The citation should be made as follows: The CEFR-J Wordlist Version 1.6. Compiled by Yukio Tono, Tokyo University of Foreign Studies. Retrieved from http:XXX on dd/mm/yy.

同頁的編製說明（與規格「不可使用 English Vocabulary Profile」有關，列此供裁示）：

> ... results were compared with the English Vocabulary Profile and non-overlapping words were added to the list as supplement. All the words have part-of-speech information and corresponding CEFR levels.

## 本專案的引用（依官方指定格式，版本改為實際使用的 1.5）

The CEFR-J Wordlist Version 1.5. Compiled by Yukio Tono, Tokyo University of Foreign Studies. Retrieved from https://github.com/openlanguageprofiles/olp-en-cefrj (commit d4e45b7) on 01/10/2026.

## 注意

- 條款未提及以 CC BY-SA 或其他授權再授權，衍生檔 `data/sources/cefrj/levels.json` 不標 CC BY-SA。
- 條款未明文允許原樣再散布全表；原 CSV 不進 git（`data/raw/` 為 gitignore 下載快取）。
