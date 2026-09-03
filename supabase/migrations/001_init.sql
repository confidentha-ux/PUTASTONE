-- 「돌 하나를 얹다」 — 초기 스키마
-- 실행 방법: Supabase 대시보드 → SQL Editor → New query → 이 파일 전체 붙여넣기 → Run
-- src/state/schema.js의 createInitialUserState() 구조를 그대로 옮긴 것이다.
-- 중첩 구조(items, derived, operationData 등)는 JSONB로 저장한다 — 앱 쪽 객체 모양을
-- 거의 그대로 저장/복원할 수 있어서 변환 코드가 최소화된다.

-- 1. profiles — auth.users 1:1 확장. Google 로그인 시 auth.users에는 자동으로 행이 생기고,
--    아래 트리거가 profiles에도 같이 행을 만든다.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  schema_version integer not null default 1,
  versions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "본인 프로필만 조회" on public.profiles
  for select using (auth.uid() = id);
create policy "본인 프로필만 수정" on public.profiles
  for update using (auth.uid() = id);
create policy "본인 프로필만 생성" on public.profiles
  for insert with check (auth.uid() = id);

-- 신규 가입 시 profiles 행을 자동으로 만든다.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, versions)
  values (
    new.id,
    '{"meditatioQuestionnaireVersion":"meditatio-v1.0","familyRoutingMatrixVersion":"v1","personaProtocolVersion":"v1","finalAnalysisArchitectureVersion":"v1.2"}'::jsonb
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. lectio_state — 「나를 받치는 돌」, 사용자당 한 행(1:1).
create table if not exists public.lectio_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  raw jsonb not null default '{}'::jsonb,
  items jsonb not null default '[]'::jsonb,
  dominant_domain jsonb,
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.lectio_state enable row level security;

create policy "본인 Lectio만 조회" on public.lectio_state
  for select using (auth.uid() = user_id);
create policy "본인 Lectio만 수정" on public.lectio_state
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3. meditatio_state — 「판단이 만들어지는 과정」, 사용자당 한 행(1:1).
create table if not exists public.meditatio_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  raw jsonb not null default '{}'::jsonb,
  derived jsonb,
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.meditatio_state enable row level security;

create policy "본인 Meditatio만 조회" on public.meditatio_state
  for select using (auth.uid() = user_id);
create policy "본인 Meditatio만 수정" on public.meditatio_state
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4. speculum_sessions — 「다른 역할 입어보기」, 사용자당 여러 행(1:N) — 덮어쓰지 않고 쌓인다.
create table if not exists public.speculum_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id text not null,
  session_timestamp timestamptz not null default now(),
  persona_id text not null,
  persona_version text,
  initial_judgment text default '',
  operation_data jsonb not null default '{}'::jsonb,
  new_information text default '',
  judgment_shift text,
  rejudgment text default '',
  change_strength numeric,
  reflection text default '',
  raw_answers jsonb not null default '{}'::jsonb,
  routing_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.speculum_sessions enable row level security;

create policy "본인 세션만 조회" on public.speculum_sessions
  for select using (auth.uid() = user_id);
create policy "본인 세션만 생성" on public.speculum_sessions
  for insert with check (auth.uid() = user_id);

create index if not exists speculum_sessions_user_id_idx on public.speculum_sessions(user_id);

-- 5. judgment_paths — 「쌓이면서 드러난 것」, 세션이 쌓인 뒤 생성되는 종합 층(1:N).
create table if not exists public.judgment_paths (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  path_id text not null,
  generated_at timestamptz not null default now(),
  based_on_session_ids jsonb not null default '[]'::jsonb,
  start jsonb,
  movement jsonb,
  critical_moment jsonb,
  release_point jsonb,
  observed_change jsonb
);

alter table public.judgment_paths enable row level security;

create policy "본인 경로만 조회" on public.judgment_paths
  for select using (auth.uid() = user_id);
create policy "본인 경로만 생성" on public.judgment_paths
  for insert with check (auth.uid() = user_id);

create index if not exists judgment_paths_user_id_idx on public.judgment_paths(user_id);
