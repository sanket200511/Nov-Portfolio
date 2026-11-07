create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  text text not null check (char_length(text) between 2 and 140),
  kind text not null default 'visitor',
  created_at timestamptz not null default now()
);

alter table notes enable row level security;

create policy "anyone can read notes" on notes for select using (true);
create policy "anyone can leave a short note" on notes for insert with check (char_length(text) between 2 and 140);
