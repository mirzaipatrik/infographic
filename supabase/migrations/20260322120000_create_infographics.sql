-- Schema only (table, grants, RLS). Applied once via `pnpm db:setup` / `supabase db push`.
-- Demo row lives in supabase/seed.sql so content can be re-seeded without a new migration.
create table public.infographics (
  id text primary key default 'default',
  content jsonb not null,
  updated_at timestamptz not null default now()
);

-- Public Data API is read-only. Writes go through the Next.js server action
-- using SUPABASE_SECRET_KEY (bypasses RLS after the action checks auth).
grant select on table public.infographics to anon, authenticated;

alter table public.infographics enable row level security;

create policy "Public can read infographics"
  on public.infographics
  for select
  to anon, authenticated
  using (true);
