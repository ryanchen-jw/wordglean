-- TASK-41：免費方案喚醒排程用的心跳。
-- 官方文件以「使用者資料庫活動（user queries）」判定閒置；被 RLS 拒絕（42501）的請求未被認列（11-23 仍被暫停）。
-- 改由 anon 經 /rest/v1/rpc/keepalive 呼叫，函式內真的寫一筆交易（更新單列心跳），回傳寫入時間。
-- 心跳表放在不對 API 公開的 private schema：anon 碰不到表本身，也不回傳任何使用者資料。

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.keepalive (
  id         smallint primary key default 1 check (id = 1), -- 永遠只有一列
  pinged_at  timestamptz not null
);
alter table private.keepalive enable row level security; -- 無 policy：只有函式擁有者寫得到
revoke all on table private.keepalive from public, anon, authenticated;

create function public.keepalive()
returns timestamptz
language sql
security definer
set search_path = ''
as $$
  insert into private.keepalive (id, pinged_at) values (1, now())
  on conflict (id) do update set pinged_at = excluded.pinged_at
  returning pinged_at;
$$;

revoke execute on function public.keepalive() from public, anon, authenticated;
grant execute on function public.keepalive() to anon;
