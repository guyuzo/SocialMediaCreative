-- Ver src/types/tarefa.ts e esquema-prisma.md.
-- Checklist independente do fluxo de conteúdo, sem FK para nenhuma outra
-- tabela, de propósito (PRD seção 6.7).
create type public.tarefa_status as enum ('pendente', 'em_andamento', 'concluida');

create table public.tarefas (
  id         uuid primary key default gen_random_uuid(),
  titulo     text not null,
  status     public.tarefa_status not null default 'pendente',
  deadline   date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tarefas_status_idx   on public.tarefas (status);
create index tarefas_deadline_idx on public.tarefas (deadline);

create trigger set_updated_at
  before update on public.tarefas
  for each row execute function public.set_updated_at();

alter table public.tarefas enable row level security;

create policy "tarefas_select_all" on public.tarefas for select using (true);
create policy "tarefas_insert_all" on public.tarefas for insert with check (true);
create policy "tarefas_update_all" on public.tarefas for update using (true) with check (true);
create policy "tarefas_delete_all" on public.tarefas for delete using (true);

grant select, insert, update, delete on public.tarefas to anon, authenticated;
