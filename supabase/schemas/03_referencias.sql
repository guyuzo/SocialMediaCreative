-- Ver src/types/referencia.ts e esquema-prisma.md.
create type public.referencia_tipo as enum ('link', 'site', 'anotacao');

create table public.referencias (
  id         uuid primary key default gen_random_uuid(),
  tema_id    uuid not null references public.temas (id) on delete cascade,
  tipo       public.referencia_tipo not null,
  titulo     text not null,
  url        text,
  conteudo   text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index referencias_tema_id_idx on public.referencias (tema_id);

create trigger set_updated_at
  before update on public.referencias
  for each row execute function public.set_updated_at();

alter table public.referencias enable row level security;

create policy "referencias_select_all" on public.referencias for select using (true);
create policy "referencias_insert_all" on public.referencias for insert with check (true);
create policy "referencias_update_all" on public.referencias for update using (true) with check (true);
create policy "referencias_delete_all" on public.referencias for delete using (true);

grant select, insert, update, delete on public.referencias to anon, authenticated;
