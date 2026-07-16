-- Ver src/types/tema.ts e esquema-prisma.md.
create table public.temas (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  cor        text not null,
  icone      text not null,
  descricao  text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at
  before update on public.temas
  for each row execute function public.set_updated_at();

alter table public.temas enable row level security;

-- Sem autenticação ainda (decisão confirmada) — policies permissivas,
-- separadas por operação para facilitar apertar uma de cada vez quando
-- autenticação entrar.
create policy "temas_select_all" on public.temas for select using (true);
create policy "temas_insert_all" on public.temas for insert with check (true);
create policy "temas_update_all" on public.temas for update using (true) with check (true);
create policy "temas_delete_all" on public.temas for delete using (true);

grant select, insert, update, delete on public.temas to anon, authenticated;
