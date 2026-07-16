-- Ver src/types/criativo.ts e esquema-prisma.md.
-- Enums de string ('4:5'/'1:1') não precisam de @map como no Prisma —
-- qualquer literal entre aspas é um rótulo de enum válido em SQL.
create type public.criativo_status  as enum ('rascunho', 'pronto', 'agendado', 'publicado');
create type public.criativo_formato as enum ('4:5', '1:1');
create type public.slide_status     as enum ('vazio', 'gerando', 'gerado', 'editado', 'erro');

create table public.criativos (
  id              uuid primary key default gen_random_uuid(),
  tema_id         uuid not null references public.temas (id) on delete cascade,
  ideia_id        uuid references public.ideias (id) on delete set null,
  titulo          text not null,
  status          public.criativo_status not null default 'rascunho',
  formato         public.criativo_formato not null,
  data_publicacao date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index criativos_tema_id_idx  on public.criativos (tema_id);
create index criativos_ideia_id_idx on public.criativos (ideia_id);
create index criativos_status_idx   on public.criativos (status);

create trigger set_updated_at
  before update on public.criativos
  for each row execute function public.set_updated_at();

-- constraint "deferrable initially deferred": removeSlide/moveSlide (ver
-- useCriativosStore.ts) renumeram `ordem` de vários slides na mesma escrita
-- lógica. Sem adiar a checagem para o fim da transação, uma colisão
-- temporária de `ordem` no meio do upsert abortaria a escrita mesmo o
-- estado final sendo válido.
create table public.slides (
  id            uuid primary key default gen_random_uuid(),
  criativo_id   uuid not null references public.criativos (id) on delete cascade,
  ordem         int not null,
  texto         text not null default '',
  imagem_url    text,
  prompt_texto  text,
  prompt_imagem text,
  status        public.slide_status not null default 'vazio',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint slides_criativo_ordem_key unique (criativo_id, ordem) deferrable initially deferred
);

create trigger set_updated_at
  before update on public.slides
  for each row execute function public.set_updated_at();

alter table public.criativos enable row level security;
create policy "criativos_select_all" on public.criativos for select using (true);
create policy "criativos_insert_all" on public.criativos for insert with check (true);
create policy "criativos_update_all" on public.criativos for update using (true) with check (true);
create policy "criativos_delete_all" on public.criativos for delete using (true);

alter table public.slides enable row level security;
create policy "slides_select_all" on public.slides for select using (true);
create policy "slides_insert_all" on public.slides for insert with check (true);
create policy "slides_update_all" on public.slides for update using (true) with check (true);
create policy "slides_delete_all" on public.slides for delete using (true);

grant select, insert, update, delete on public.criativos to anon, authenticated;
grant select, insert, update, delete on public.slides    to anon, authenticated;

-- RPC transacional: sincroniza um Criativo + todos os seus Slides numa
-- única chamada, espelhando o padrão "persist(criativo) sempre manda o
-- objeto inteiro" de useCriativosStore.ts (updateSlide, addSlide,
-- removeSlide, moveSlide, agendar, desagendar, update).
create or replace function public.save_criativo(p_criativo jsonb, p_slides jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  insert into public.criativos (id, tema_id, ideia_id, titulo, status, formato, data_publicacao)
  values (
    (p_criativo->>'id')::uuid,
    (p_criativo->>'temaId')::uuid,
    nullif(p_criativo->>'ideiaId', '')::uuid,
    p_criativo->>'titulo',
    (p_criativo->>'status')::criativo_status,
    (p_criativo->>'formato')::criativo_formato,
    (p_criativo->>'dataPublicacao')::date
  )
  on conflict (id) do update set
    tema_id         = excluded.tema_id,
    ideia_id        = excluded.ideia_id,
    titulo          = excluded.titulo,
    status          = excluded.status,
    formato         = excluded.formato,
    data_publicacao = excluded.data_publicacao;

  -- remove slides que não estão mais no array (ex: removeSlide)
  delete from public.slides s
  where s.criativo_id = (p_criativo->>'id')::uuid
    and not exists (
      select 1 from jsonb_array_elements(p_slides) e
      where (e->>'id')::uuid = s.id
    );

  -- upsert dos slides restantes/novos, incluindo ordem renumerada
  insert into public.slides (id, criativo_id, ordem, texto, imagem_url, prompt_texto, prompt_imagem, status)
  select
    (e->>'id')::uuid,
    (p_criativo->>'id')::uuid,
    (e->>'ordem')::int,
    coalesce(e->>'texto', ''),
    e->>'imagemUrl',
    e->>'promptTexto',
    e->>'promptImagem',
    (e->>'status')::slide_status
  from jsonb_array_elements(p_slides) e
  on conflict (id) do update set
    ordem         = excluded.ordem,
    texto         = excluded.texto,
    imagem_url    = excluded.imagem_url,
    prompt_texto  = excluded.prompt_texto,
    prompt_imagem = excluded.prompt_imagem,
    status        = excluded.status;
end;
$$;

grant execute on function public.save_criativo(jsonb, jsonb) to anon, authenticated;
