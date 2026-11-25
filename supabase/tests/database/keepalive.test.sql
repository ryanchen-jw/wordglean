-- TASK-41：喚醒心跳只開一個 anon 可執行的函式，真的寫入、不回傳使用者資料、不放寬其他權限。
begin;
create extension if not exists pgtap with schema extensions;

select plan(9);

select has_function('public', 'keepalive', array[]::text[], 'public.keepalive() 存在');
select function_returns('public', 'keepalive', array[]::text[], 'timestamp with time zone', '只回傳心跳時間');
select is_definer('public', 'keepalive', array[]::text[], 'security definer');
select ok((select 'search_path=""' = any(proconfig) from pg_proc where oid = 'public.keepalive()'::regprocedure),
  '函式鎖定 search_path');
select ok(has_function_privilege('anon', 'public.keepalive()', 'execute'), 'anon 可執行');
select ok(not has_function_privilege('authenticated', 'public.keepalive()', 'execute'), 'authenticated 不可執行');
select ok(not has_schema_privilege('anon', 'private', 'usage'), 'anon 碰不到 private schema');

set local role anon;
select isnt(public.keepalive(), null, 'anon 呼叫成功並回傳時間');
reset role;
select is((select count(*)::int from private.keepalive), 1, '心跳表只有一列（重複呼叫是更新）');

select * from finish();
rollback;
