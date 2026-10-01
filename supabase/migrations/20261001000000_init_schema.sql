-- LinguaApp 初始 schema（TASK-19）
-- 規格 §3：登入後同步；伺服器不收錄音（無音訊欄位）、不碰金鑰（無金鑰欄位）。
-- 時間一律 timestamptz（本機 UTC epoch ms ↔ 雲端 timestamptz，對照表見 supabase/CLAUDE.md）。
-- RLS：每表只允許 authenticated 讀寫自己的列；anon 無任何權限。

-- ── profiles ──────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  cefr_level  text check (cefr_level in ('A1', 'A2', 'B1', 'B2', 'C1')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 註冊時自動建 profile
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── settings ──────────────────────────────────────────────
-- updated_at 由用戶端寫入（設定以最後修改時間合併，TASK-20），伺服器不覆寫。
create table public.settings (
  user_id            uuid primary key references auth.users (id) on delete cascade,
  daily_new_limit    integer not null default 10 check (daily_new_limit >= 0),
  pause_multiplier   integer not null default 10 check (pause_multiplier >= 0),
  desired_retention  double precision not null default 0.9
                     check (desired_retention > 0 and desired_retention < 1),
  updated_at         timestamptz not null default now()
);

-- ── word_pool ─────────────────────────────────────────────
-- ts-fsrs Card 快取；權威狀態由 review_logs 重播得出（TASK-20）。
create table public.word_pool (
  user_id         uuid not null references auth.users (id) on delete cascade,
  word_id         text not null,
  state           smallint not null check (state between 0 and 3),
  due             timestamptz not null,
  stability       double precision not null check (stability >= 0),
  difficulty      double precision not null check (difficulty >= 0),
  scheduled_days  integer not null check (scheduled_days >= 0),
  learning_steps  integer not null check (learning_steps >= 0),
  reps            integer not null check (reps >= 0),
  lapses          integer not null check (lapses >= 0),
  last_review     timestamptz,
  course_refs     text[] not null default '{}',
  added_at        timestamptz not null,
  primary key (user_id, word_id)
);

-- ── review_logs ───────────────────────────────────────────
-- = ts-fsrs FSRSHistory（不含已棄用 elapsed_days／last_elapsed_days）；id 由用戶端產生供去重。
-- append-only：不開 update。
create table public.review_logs (
  id              uuid primary key,
  user_id         uuid not null references auth.users (id) on delete cascade,
  word_id         text not null,
  rating          smallint not null check (rating between 1 and 4),
  state           smallint not null check (state between 0 and 3),
  due             timestamptz not null,
  stability       double precision not null check (stability >= 0),
  difficulty      double precision not null check (difficulty >= 0),
  scheduled_days  integer not null check (scheduled_days >= 0),
  learning_steps  integer not null check (learning_steps >= 0),
  review          timestamptz not null
);

create index review_logs_user_word_review_idx
  on public.review_logs (user_id, word_id, review);

-- ── course_progress ───────────────────────────────────────
create table public.course_progress (
  user_id       uuid not null references auth.users (id) on delete cascade,
  lesson_id     text not null,
  completed_at  timestamptz,
  updated_at    timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- ── favorites ─────────────────────────────────────────────
-- deleted_at 為墓碑：取消收藏不刪列，合併時才不會被另一裝置「復活」。
create table public.favorites (
  user_id     uuid not null references auth.users (id) on delete cascade,
  word_id     text not null,
  created_at  timestamptz not null default now(),
  deleted_at  timestamptz,
  updated_at  timestamptz not null default now(),
  primary key (user_id, word_id)
);

-- ── speech_corrections ────────────────────────────────────
-- 只存文字：辨識結果與使用者修正（規格 §6），不存錄音。
create table public.speech_corrections (
  id               uuid primary key,
  user_id          uuid not null references auth.users (id) on delete cascade,
  item_id          text not null,
  target_text      text not null,
  recognized_text  text not null,
  corrected_text   text not null,
  created_at       timestamptz not null
);

-- ── 權限與 RLS ────────────────────────────────────────────
revoke all on table
  public.profiles, public.settings, public.word_pool, public.review_logs,
  public.course_progress, public.favorites, public.speech_corrections
from anon;

-- TRUNCATE 不受 RLS 管（A 可清掉 B 的列）；REFERENCES／TRIGGER 用戶端用不到
revoke truncate, references, trigger on table
  public.profiles, public.settings, public.word_pool, public.review_logs,
  public.course_progress, public.favorites, public.speech_corrections
from authenticated;

alter table public.profiles           enable row level security;
alter table public.settings           enable row level security;
alter table public.word_pool          enable row level security;
alter table public.review_logs        enable row level security;
alter table public.course_progress    enable row level security;
alter table public.favorites          enable row level security;
alter table public.speech_corrections enable row level security;

-- profiles：insert 由觸發器、刪除隨 auth.users cascade
create policy profiles_select_own on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy profiles_update_own on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- review_logs：append-only
revoke update on table public.review_logs from authenticated;
create policy review_logs_select_own on public.review_logs
  for select to authenticated using ((select auth.uid()) = user_id);
create policy review_logs_insert_own on public.review_logs
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy review_logs_delete_own on public.review_logs
  for delete to authenticated using ((select auth.uid()) = user_id);

-- 其餘表：讀寫自己的列
create policy settings_all_own on public.settings
  for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy word_pool_all_own on public.word_pool
  for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy course_progress_all_own on public.course_progress
  for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy favorites_all_own on public.favorites
  for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy speech_corrections_all_own on public.speech_corrections
  for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
