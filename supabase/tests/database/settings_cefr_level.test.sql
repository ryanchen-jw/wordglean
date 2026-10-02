-- TASK-17：settings.cefr_level（目前級距，分級測驗結果／跳過＝A1／設定頁手動改）。
-- 可空＝未分級；只收 A1–C1（規格 §4 內部分級軸，多益對照無 C2）。
begin;
create extension if not exists pgtap with schema extensions;

select plan(6);

select has_column('public', 'settings', 'cefr_level', 'settings 有 cefr_level');
select col_type_is('public', 'settings', 'cefr_level', 'text', 'cefr_level 為 text');
select col_is_null('public', 'settings', 'cefr_level', 'cefr_level 可空（未分級）');

insert into auth.users (id, email) values ('11111111-1111-1111-1111-111111111111', 'a@test.local');
insert into public.settings (user_id) values ('11111111-1111-1111-1111-111111111111');
select is((select cefr_level from public.settings), null, '新列預設未分級（null）');

update public.settings set cefr_level = 'C1';
select is((select cefr_level from public.settings), 'C1', '可寫入 A1–C1');

select throws_ok($$ update public.settings set cefr_level = 'C2' $$, '23514', null,
  '不收 C2 等範圍外的值');

select * from finish();
rollback;
