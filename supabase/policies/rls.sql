create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null check (role in ('admin', 'member')) default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  type text not null,
  status text not null,
  summary text not null,
  description text not null,
  lead_name text not null,
  start_date date not null,
  end_date date,
  target_audience text not null,
  key_purpose text not null,
  partners text[] not null default '{}',
  funding_source text,
  budget_note text,
  tags text[] not null default '{}',
  related_links jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.actions (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  notes text not null default '',
  owner_name text not null,
  status text not null,
  due_date date,
  priority text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.calendar_items (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  type text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.outcomes (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  date date not null,
  activity text not null,
  outcome_type text not null,
  audience text not null,
  number_reached integer,
  summary text not null,
  impact_note text not null,
  quote_or_story text,
  evidence_links jsonb not null default '[]'::jsonb,
  follow_up_needed boolean not null default false,
  follow_up_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  type text not null,
  description text not null,
  link text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_actions_project_due on public.actions(project_id, due_date);
create index if not exists idx_calendar_starts_at on public.calendar_items(starts_at);
create index if not exists idx_outcomes_project_date on public.outcomes(project_id, date desc);
create index if not exists idx_resources_project on public.resources(project_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at before update on public.projects for each row execute function public.set_updated_at();
drop trigger if exists set_actions_updated_at on public.actions;
create trigger set_actions_updated_at before update on public.actions for each row execute function public.set_updated_at();
drop trigger if exists set_calendar_updated_at on public.calendar_items;
create trigger set_calendar_updated_at before update on public.calendar_items for each row execute function public.set_updated_at();
drop trigger if exists set_outcomes_updated_at on public.outcomes;
create trigger set_outcomes_updated_at before update on public.outcomes for each row execute function public.set_updated_at();
drop trigger if exists set_resources_updated_at on public.resources;
create trigger set_resources_updated_at before update on public.resources for each row execute function public.set_updated_at();

create or replace function public.current_role() returns text language sql stable as $$
  select coalesce((select role from public.profiles where user_id = auth.uid()), 'member');
$$;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.actions enable row level security;
alter table public.calendar_items enable row level security;
alter table public.outcomes enable row level security;
alter table public.resources enable row level security;

create policy "profiles self" on public.profiles for select to authenticated using (auth.uid() = user_id);
create policy "projects read" on public.projects for select to authenticated using (true);
create policy "projects write" on public.projects for insert to authenticated with check (true);
create policy "projects update" on public.projects for update to authenticated using (true) with check (true);
create policy "projects delete admin" on public.projects for delete to authenticated using (public.current_role() = 'admin');

create policy "actions read" on public.actions for select to authenticated using (true);
create policy "actions write" on public.actions for all to authenticated using (true) with check (true);
create policy "calendar read" on public.calendar_items for select to authenticated using (true);
create policy "calendar write" on public.calendar_items for all to authenticated using (true) with check (true);
create policy "outcomes read" on public.outcomes for select to authenticated using (true);
create policy "outcomes write" on public.outcomes for all to authenticated using (true) with check (true);
create policy "resources read" on public.resources for select to authenticated using (true);
create policy "resources write" on public.resources for all to authenticated using (true) with check (true);
