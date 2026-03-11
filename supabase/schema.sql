create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'member')) default 'member',
  full_name text,
  created_at timestamptz not null default now()
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
  action_items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.calendar_items (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  type text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  url text not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.stories (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  what_happened text not null,
  why_it_matters text not null,
  evidence_note text not null,
  date date not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.calendar_items enable row level security;
alter table public.resources enable row level security;
alter table public.stories enable row level security;

create or replace function public.current_role()
returns text
language sql
stable
as $$
  select coalesce((select role from public.profiles where user_id = auth.uid()), 'member');
$$;

create policy "read all authenticated" on public.projects for select to authenticated using (true);
create policy "write members" on public.projects for insert to authenticated with check (true);
create policy "update members" on public.projects for update to authenticated using (true) with check (true);
create policy "delete admins only" on public.projects for delete to authenticated using (public.current_role() = 'admin');

create policy "read calendar" on public.calendar_items for select to authenticated using (true);
create policy "write calendar" on public.calendar_items for all to authenticated using (true) with check (true);

create policy "read resources" on public.resources for select to authenticated using (true);
create policy "write resources" on public.resources for all to authenticated using (true) with check (true);

create policy "read stories" on public.stories for select to authenticated using (true);
create policy "write stories" on public.stories for all to authenticated using (true) with check (true);
