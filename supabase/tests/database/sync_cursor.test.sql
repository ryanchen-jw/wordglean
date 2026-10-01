-- TASK-20 拉取游標：review_logs.inserted_at 由伺服器決定，用戶端可讀、不可指定。
begin;
create extension if not exists pgtap with schema extensions;

select plan(7);

select col_type_is('public', 'review_logs', 'inserted_at', 'timestamp with time zone',
  'review_logs.inserted_at 為 timestamptz');
select col_not_null('public', 'review_logs', 'inserted_at', 'inserted_at 不可為空');
select has_index('public', 'review_logs', 'review_logs_user_inserted_at_idx',
  array['user_id', 'inserted_at', 'id'], '游標查詢索引 (user_id, inserted_at, id)');

insert into auth.users (id, email) values ('11111111-1111-1111-1111-111111111111', 'a@test.local');

-- 以登入者身分（同 PostgREST 帶 JWT 的路徑）寫入，並企圖指定一個很舊的 inserted_at
set local role authenticated;
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

insert into public.review_logs (id, user_id, word_id, rating, state, due, stability,
  difficulty, scheduled_days, learning_steps, review, inserted_at) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'apple',
   3, 0, '2026-10-01T00:00:00Z', 0, 0, 0, 0, '2026-10-01T00:00:00Z', '2000-01-01T00:00:00Z');

select is((select inserted_at from public.review_logs where id = 'aaaaaaaa-0000-0000-0000-000000000001'),
  now(), '用戶端給的 inserted_at 被伺服器時間覆寫');

insert into public.review_logs (id, user_id, word_id, rating, state, due, stability,
  difficulty, scheduled_days, learning_steps, review) values
  ('aaaaaaaa-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'apple',
   3, 1, '2026-10-01T00:10:00Z', 0, 0, 0, 0, '2026-10-01T00:10:00Z');

select is((select count(*)::int from public.review_logs where inserted_at >= now()),
  2, '登入者可依 inserted_at 查自己的紀錄');

-- 重推同一筆（ON CONFLICT DO NOTHING，PostgREST ignore-duplicates 的語意）：不報錯、不重複
select lives_ok($$
  insert into public.review_logs (id, user_id, word_id, rating, state, due, stability,
    difficulty, scheduled_days, learning_steps, review) values
    ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'apple',
     3, 0, '2026-10-01T00:00:00Z', 0, 0, 0, 0, '2026-10-01T00:00:00Z')
  on conflict (id) do nothing
$$, '重推同一筆作答紀錄不報錯');
select is((select count(*)::int from public.review_logs), 2, '重推後仍只有 2 筆');

select * from finish();
rollback;
