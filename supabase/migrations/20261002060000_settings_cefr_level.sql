-- TASK-17：目前級距存進 settings，隨設定一起以最後修改時間合併、同步（TASK-20 的設定同步路徑）。
-- null＝未分級。profiles.cefr_level（TASK-19 預留）不使用、保留不刪。

alter table public.settings
  add column cefr_level text check (cefr_level in ('A1', 'A2', 'B1', 'B2', 'C1'));
