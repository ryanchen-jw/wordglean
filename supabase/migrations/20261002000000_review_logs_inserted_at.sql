-- TASK-20：作答紀錄的拉取游標。
-- review 是用戶端作答時間，離線裝置晚上傳的舊紀錄 review 會早於游標而被漏拉；
-- 改以伺服器寫入時間 inserted_at 當游標（用戶端拉取時往前留重疊窗、以 id 去重）。
-- inserted_at 一律由觸發器設為 now()，用戶端給的值不採用。

alter table public.review_logs
  add column inserted_at timestamptz not null default now();

create function public.review_logs_set_inserted_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.inserted_at := now();
  return new;
end;
$$;

revoke execute on function public.review_logs_set_inserted_at() from public, anon, authenticated;

create trigger review_logs_set_inserted_at
  before insert on public.review_logs
  for each row execute function public.review_logs_set_inserted_at();

create index review_logs_user_inserted_at_idx
  on public.review_logs (user_id, inserted_at, id);
