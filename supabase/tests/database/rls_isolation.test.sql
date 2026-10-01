-- TASK-19 AC#2：A 使用者讀寫 B 的資料全部被拒；anon 一律被拒。
-- 另含正向對照（A 能操作自己的列），防止「全部拒絕也綠」。
-- 以 set local role ＋ request.jwt.claims 模擬 PostgREST 帶 JWT 的請求（同一條 RLS 執行路徑）。
begin;
create extension if not exists pgtap with schema extensions;

select plan(66);

-- 測試輔助：回傳 DML 影響列數（security invoker，以當下角色執行）
create schema tests;
grant usage on schema tests to authenticated, anon;
create function tests.affected(sql text) returns integer
language plpgsql as $$
declare n integer;
begin
  execute sql;
  get diagnostics n = row_count;
  return n;
end;
$$;
grant execute on function tests.affected(text) to authenticated, anon;

-- ── 種資料（postgres 身分、繞過 RLS）────────────────────────
-- A = 1111…、B = 2222…；profiles 由註冊觸發器自動建立
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'a@test.local'),
  ('22222222-2222-2222-2222-222222222222', 'b@test.local');

insert into public.settings (user_id) values
  ('11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222222');

insert into public.word_pool (user_id, word_id, state, due, stability, difficulty,
  scheduled_days, learning_steps, reps, lapses, added_at) values
  ('11111111-1111-1111-1111-111111111111', 'apple', 0, '2026-10-01T00:00:00Z', 0, 0, 0, 0, 0, 0, '2026-10-01T00:00:00Z'),
  ('22222222-2222-2222-2222-222222222222', 'bread', 0, '2026-10-01T00:00:00Z', 0, 0, 0, 0, 0, 0, '2026-10-01T00:00:00Z');

insert into public.review_logs (id, user_id, word_id, rating, state, due, stability,
  difficulty, scheduled_days, learning_steps, review) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'apple', 3, 0, '2026-10-01T00:00:00Z', 0, 0, 0, 0, '2026-10-01T00:00:00Z'),
  ('bbbbbbbb-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'bread', 3, 0, '2026-10-01T00:00:00Z', 0, 0, 0, 0, '2026-10-01T00:00:00Z');

insert into public.course_progress (user_id, lesson_id) values
  ('11111111-1111-1111-1111-111111111111', 'a1-u1-l1'),
  ('22222222-2222-2222-2222-222222222222', 'a1-u1-l1');

insert into public.favorites (user_id, word_id) values
  ('11111111-1111-1111-1111-111111111111', 'apple'),
  ('22222222-2222-2222-2222-222222222222', 'bread');

insert into public.speech_corrections (id, user_id, item_id, target_text,
  recognized_text, corrected_text, created_at) values
  ('aaaaaaaa-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'q1', 'I like apples', 'I like apple', 'I like apples', '2026-10-01T00:00:00Z'),
  ('bbbbbbbb-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'q1', 'I like bread', 'I like red', 'I like bread', '2026-10-01T00:00:00Z');

-- ── 以 A 身分 ───────────────────────────────────────────────
set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

-- profiles（7）
select results_eq($$ select id::text from public.profiles $$,
  array['11111111-1111-1111-1111-111111111111'], 'profiles：A 只看得到自己');
select is(tests.affected($$ update public.profiles set cefr_level = 'C1' where id = '22222222-2222-2222-2222-222222222222' $$),
  0, 'profiles：A 改 B 影響 0 列');
select is(tests.affected($$ delete from public.profiles where id = '22222222-2222-2222-2222-222222222222' $$),
  0, 'profiles：A 刪 B 影響 0 列');
select throws_ok($$ insert into public.profiles (id) values ('33333333-3333-3333-3333-333333333333') $$,
  '42501', null, 'profiles：A 不能自行 insert');
select throws_ok($$ update public.profiles set id = '22222222-2222-2222-2222-222222222222' where id = '11111111-1111-1111-1111-111111111111' $$,
  '42501', null, 'profiles：A 不能把自己的列改成 B 的 id');
select is(tests.affected($$ update public.profiles set cefr_level = 'B1' where id = '11111111-1111-1111-1111-111111111111' $$),
  1, 'profiles：正向對照——A 改自己 1 列');
select is(tests.affected($$ delete from public.profiles where id = '11111111-1111-1111-1111-111111111111' $$),
  0, 'profiles：A 也不能刪自己的 profile（隨帳號 cascade）');

-- settings（7）
select results_eq($$ select user_id::text from public.settings $$,
  array['11111111-1111-1111-1111-111111111111'], 'settings：A 只看得到自己');
select throws_ok($$ insert into public.settings (user_id) values ('22222222-2222-2222-2222-222222222222') $$,
  '42501', null, 'settings：A 以 B 的 user_id insert 被拒');
select is(tests.affected($$ update public.settings set daily_new_limit = 99 where user_id = '22222222-2222-2222-2222-222222222222' $$),
  0, 'settings：A 改 B 影響 0 列');
select is(tests.affected($$ delete from public.settings where user_id = '22222222-2222-2222-2222-222222222222' $$),
  0, 'settings：A 刪 B 影響 0 列');
select throws_ok($$ update public.settings set user_id = '22222222-2222-2222-2222-222222222222' where user_id = '11111111-1111-1111-1111-111111111111' $$,
  '42501', null, 'settings：A 不能把自己的列轉給 B');
select is(tests.affected($$ update public.settings set daily_new_limit = 20 where user_id = '11111111-1111-1111-1111-111111111111' $$),
  1, 'settings：正向對照——A 改自己 1 列');
select is(tests.affected($$ delete from public.settings where user_id = '11111111-1111-1111-1111-111111111111' $$),
  1, 'settings：正向對照——A 刪自己 1 列');

-- word_pool（7）
select results_eq($$ select word_id from public.word_pool $$,
  array['apple'], 'word_pool：A 只看得到自己');
select throws_ok($$ insert into public.word_pool (user_id, word_id, state, due, stability, difficulty, scheduled_days, learning_steps, reps, lapses, added_at)
  values ('22222222-2222-2222-2222-222222222222', 'cat', 0, now(), 0, 0, 0, 0, 0, 0, now()) $$,
  '42501', null, 'word_pool：A 以 B 的 user_id insert 被拒');
select is(tests.affected($$ update public.word_pool set reps = 99 where user_id = '22222222-2222-2222-2222-222222222222' $$),
  0, 'word_pool：A 改 B 影響 0 列');
select is(tests.affected($$ delete from public.word_pool where user_id = '22222222-2222-2222-2222-222222222222' $$),
  0, 'word_pool：A 刪 B 影響 0 列');
select throws_ok($$ update public.word_pool set user_id = '22222222-2222-2222-2222-222222222222' where user_id = '11111111-1111-1111-1111-111111111111' $$,
  '42501', null, 'word_pool：A 不能把自己的列轉給 B');
select is(tests.affected($$ insert into public.word_pool (user_id, word_id, state, due, stability, difficulty, scheduled_days, learning_steps, reps, lapses, added_at)
  values ('11111111-1111-1111-1111-111111111111', 'cat', 0, now(), 0, 0, 0, 0, 0, 0, now()) $$),
  1, 'word_pool：正向對照——A insert 自己 1 列');
select is(tests.affected($$ update public.word_pool set reps = 1 where user_id = '11111111-1111-1111-1111-111111111111' $$),
  2, 'word_pool：正向對照——A 改自己 2 列');

-- review_logs（8）
select results_eq($$ select id::text from public.review_logs $$,
  array['aaaaaaaa-0000-0000-0000-000000000001'], 'review_logs：A 只看得到自己');
select throws_ok($$ insert into public.review_logs (id, user_id, word_id, rating, state, due, stability, difficulty, scheduled_days, learning_steps, review)
  values ('cccccccc-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'bread', 1, 2, now(), 1, 5, 1, 0, now()) $$,
  '42501', null, 'review_logs：A 以 B 的 user_id insert 被拒');
select throws_ok($$ update public.review_logs set rating = 1 where user_id = '22222222-2222-2222-2222-222222222222' $$,
  '42501', null, 'review_logs：A 改 B 被拒（append-only，無 update 權限）');
select is(tests.affected($$ delete from public.review_logs where user_id = '22222222-2222-2222-2222-222222222222' $$),
  0, 'review_logs：A 刪 B 影響 0 列');
select throws_ok($$ update public.review_logs set rating = 1 where user_id = '11111111-1111-1111-1111-111111111111' $$,
  '42501', null, 'review_logs：A 連自己的也不能改（append-only）');
select is(tests.affected($$ insert into public.review_logs (id, user_id, word_id, rating, state, due, stability, difficulty, scheduled_days, learning_steps, review)
  values ('aaaaaaaa-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'apple', 4, 1, now(), 2, 4, 2, 0, now()) $$),
  1, 'review_logs：正向對照——A insert 自己 1 列');
select is(tests.affected($$ delete from public.review_logs where id = 'aaaaaaaa-0000-0000-0000-000000000003' $$),
  1, 'review_logs：正向對照——A 刪自己 1 列');
select throws_ok($$ insert into public.review_logs (id, user_id, word_id, rating, state, due, stability, difficulty, scheduled_days, learning_steps, review)
  values ('bbbbbbbb-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'apple', 3, 0, now(), 0, 0, 0, 0, now()) $$,
  '23505', null, 'review_logs：用戶端 id 重複即拒（去重鍵）');

-- course_progress（6）
select results_eq($$ select user_id::text from public.course_progress $$,
  array['11111111-1111-1111-1111-111111111111'], 'course_progress：A 只看得到自己');
select throws_ok($$ insert into public.course_progress (user_id, lesson_id) values ('22222222-2222-2222-2222-222222222222', 'a1-u1-l2') $$,
  '42501', null, 'course_progress：A 以 B 的 user_id insert 被拒');
select is(tests.affected($$ update public.course_progress set completed_at = now() where user_id = '22222222-2222-2222-2222-222222222222' $$),
  0, 'course_progress：A 改 B 影響 0 列');
select is(tests.affected($$ delete from public.course_progress where user_id = '22222222-2222-2222-2222-222222222222' $$),
  0, 'course_progress：A 刪 B 影響 0 列');
select throws_ok($$ update public.course_progress set user_id = '22222222-2222-2222-2222-222222222222', lesson_id = 'x' where user_id = '11111111-1111-1111-1111-111111111111' $$,
  '42501', null, 'course_progress：A 不能把自己的列轉給 B');
select is(tests.affected($$ update public.course_progress set completed_at = now() where user_id = '11111111-1111-1111-1111-111111111111' $$),
  1, 'course_progress：正向對照——A 改自己 1 列');

-- favorites（6）
select results_eq($$ select word_id from public.favorites $$,
  array['apple'], 'favorites：A 只看得到自己');
select throws_ok($$ insert into public.favorites (user_id, word_id) values ('22222222-2222-2222-2222-222222222222', 'cat') $$,
  '42501', null, 'favorites：A 以 B 的 user_id insert 被拒');
select is(tests.affected($$ update public.favorites set deleted_at = now() where user_id = '22222222-2222-2222-2222-222222222222' $$),
  0, 'favorites：A 改 B 影響 0 列');
select is(tests.affected($$ delete from public.favorites where user_id = '22222222-2222-2222-2222-222222222222' $$),
  0, 'favorites：A 刪 B 影響 0 列');
select throws_ok($$ update public.favorites set user_id = '22222222-2222-2222-2222-222222222222' where user_id = '11111111-1111-1111-1111-111111111111' $$,
  '42501', null, 'favorites：A 不能把自己的列轉給 B');
select is(tests.affected($$ update public.favorites set deleted_at = now() where user_id = '11111111-1111-1111-1111-111111111111' $$),
  1, 'favorites：正向對照——A 標自己墓碑 1 列');

-- speech_corrections（6）
select results_eq($$ select id::text from public.speech_corrections $$,
  array['aaaaaaaa-0000-0000-0000-000000000002'], 'speech_corrections：A 只看得到自己');
select throws_ok($$ insert into public.speech_corrections (id, user_id, item_id, target_text, recognized_text, corrected_text, created_at)
  values ('cccccccc-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'q2', 't', 'r', 'c', now()) $$,
  '42501', null, 'speech_corrections：A 以 B 的 user_id insert 被拒');
select is(tests.affected($$ update public.speech_corrections set corrected_text = 'x' where user_id = '22222222-2222-2222-2222-222222222222' $$),
  0, 'speech_corrections：A 改 B 影響 0 列');
select is(tests.affected($$ delete from public.speech_corrections where user_id = '22222222-2222-2222-2222-222222222222' $$),
  0, 'speech_corrections：A 刪 B 影響 0 列');
select throws_ok($$ update public.speech_corrections set user_id = '22222222-2222-2222-2222-222222222222' where user_id = '11111111-1111-1111-1111-111111111111' $$,
  '42501', null, 'speech_corrections：A 不能把自己的列轉給 B');
select is(tests.affected($$ insert into public.speech_corrections (id, user_id, item_id, target_text, recognized_text, corrected_text, created_at)
  values ('aaaaaaaa-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'q2', 't', 'r', 'c', now()) $$),
  1, 'speech_corrections：正向對照——A insert 自己 1 列');

-- TRUNCATE 繞過 RLS，必須在權限層擋（1）
select throws_ok($$ truncate public.favorites $$,
  '42501', null, 'A 不能 TRUNCATE（否則可清掉 B 的列）');

-- ── 以 anon 身分（7）：全表 permission denied ──────────────
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
select throws_ok($$ select * from public.profiles $$, '42501', null, 'anon：profiles 被拒');
select throws_ok($$ select * from public.settings $$, '42501', null, 'anon：settings 被拒');
select throws_ok($$ select * from public.word_pool $$, '42501', null, 'anon：word_pool 被拒');
select throws_ok($$ select * from public.review_logs $$, '42501', null, 'anon：review_logs 被拒');
select throws_ok($$ select * from public.course_progress $$, '42501', null, 'anon：course_progress 被拒');
select throws_ok($$ select * from public.favorites $$, '42501', null, 'anon：favorites 被拒');
select throws_ok($$ select * from public.speech_corrections $$, '42501', null, 'anon：speech_corrections 被拒');

-- ── 回 postgres：確認 B 的資料原封不動（11）─────────────────
reset role;
select is((select cefr_level from public.profiles where id = '22222222-2222-2222-2222-222222222222'), null, 'B profile 未被改');
select is((select daily_new_limit from public.settings where user_id = '22222222-2222-2222-2222-222222222222'), 10, 'B settings 未被改');
select is((select reps from public.word_pool where user_id = '22222222-2222-2222-2222-222222222222'), 0, 'B word_pool 未被改');
select is((select count(*)::int from public.word_pool where user_id = '22222222-2222-2222-2222-222222222222'), 1, 'B word_pool 無新增列');
select is((select rating::int from public.review_logs where user_id = '22222222-2222-2222-2222-222222222222'), 3, 'B review_logs 未被改');
select is((select count(*)::int from public.review_logs where user_id = '22222222-2222-2222-2222-222222222222'), 1, 'B review_logs 無新增列');
select is((select completed_at from public.course_progress where user_id = '22222222-2222-2222-2222-222222222222'), null, 'B course_progress 未被改');
select is((select deleted_at from public.favorites where user_id = '22222222-2222-2222-2222-222222222222'), null, 'B favorites 未被改');
select is((select count(*)::int from public.favorites where user_id = '22222222-2222-2222-2222-222222222222'), 1, 'B favorites 無新增列');
select is((select corrected_text from public.speech_corrections where user_id = '22222222-2222-2222-2222-222222222222'), 'I like bread', 'B speech_corrections 未被改');
select is((select count(*)::int from public.speech_corrections where user_id = '22222222-2222-2222-2222-222222222222'), 1, 'B speech_corrections 無新增列');

select * from finish();
rollback;
