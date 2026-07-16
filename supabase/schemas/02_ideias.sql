-- Ver src/types/ideia.ts e esquema-prisma.md.
create table public.ideias (
  id         uuid primary key default gen_random_uuid(),
  tema_id    uuid not null references public.temas (id) on delete cascade,
  titulo     text not null,
  resumo     text not null default '',
  promovida  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ideias_tema_id_idx on public.ideias (tema_id);

create trigger set_updated_at
  before update on public.ideias
  for each row execute function public.set_updated_at();

alter table public.ideias enable row level security;

create policy "ideias_select_all" on public.ideias for select using (true);
create policy "ideias_insert_all" on public.ideias for insert with check (true);
create policy "ideias_update_all" on public.ideias for update using (true) with check (true);
create policy "ideias_delete_all" on public.ideias for delete using (true);

grant select, insert, update, delete on public.ideias to anon, authenticated;
