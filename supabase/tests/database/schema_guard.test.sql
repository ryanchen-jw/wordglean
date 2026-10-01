-- TASK-19 目錄守衛：防日後新增的表漏開 RLS、或混入錄音／金鑰欄位（規格 §2、§3）。
begin;
create extension if not exists pgtap with schema extensions;

select plan(8);

select tables_are('public', array[
  'profiles', 'settings', 'word_pool', 'review_logs',
  'course_progress', 'favorites', 'speech_corrections'
], 'public 只有規格內七張表（新增表須同步更新本守衛與 RLS 測試）');

select is_empty($$
  select c.relname from pg_class c
  where c.relnamespace = 'public'::regnamespace and c.relkind in ('r', 'p')
    and not c.relrowsecurity
$$, 'public 每張表都開 RLS');

select is_empty($$
  select table_name || '.' || column_name from information_schema.columns
  where table_schema = 'public' and data_type = 'bytea'
$$, '伺服器不收錄音：public 無 bytea 欄');

select is_empty($$
  select table_name || '.' || column_name from information_schema.columns
  where table_schema = 'public' and column_name ~* '(key|secret|token|password|audio|recording)'
$$, '伺服器不碰金鑰、不存錄音：無可疑欄名');

select is_empty($$
  select table_name || ':' || privilege_type from information_schema.role_table_grants
  where table_schema = 'public' and grantee = 'anon'
$$, 'anon 對 public 表無任何權限');

-- TRUNCATE 不受 RLS 管，留著等於 A 能清掉 B 的列；REFERENCES／TRIGGER 用戶端用不到
select is_empty($$
  select grantee || ' ' || table_name || ':' || privilege_type from information_schema.role_table_grants
  where table_schema = 'public' and grantee in ('authenticated', 'anon')
    and privilege_type in ('TRUNCATE', 'REFERENCES', 'TRIGGER')
$$, 'authenticated／anon 對 public 表無 TRUNCATE／REFERENCES／TRIGGER');

-- 預設值依規格 §7：每日新字 10、保留率 0.9；暫停倍數 10 為 TASK-10 代決值
insert into auth.users (id, email) values ('11111111-1111-1111-1111-111111111111', 'a@test.local');
insert into public.settings (user_id) values ('11111111-1111-1111-1111-111111111111');
select results_eq($$
  select daily_new_limit, pause_multiplier, desired_retention from public.settings
$$, $$ values (10, 10, 0.9::double precision) $$, 'settings 預設值＝規格 §7（10／10／0.9）');

select is((select count(*)::int from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  1, '註冊即自動建 profile');

select * from finish();
rollback;
