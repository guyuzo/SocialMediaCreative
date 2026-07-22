-- Arquitetura de nodes (Fase B do pivô pra canvas de nodes — ver
-- esquema-prisma.md e o plano em C:\Users\DESKTOP\.claude\plans\agile-humming-boot.md).
-- Reaproveita `criativos`/`slides` (04_criativos_slides.sql) em vez de criar
-- tabelas paralelas: `slides.status` já modela o ciclo de vida de um
-- Sub-Node. Sem `user_id`/RLS por dono — mesma decisão sem-autenticação já
-- tomada pro resto do banco (ver esquema-prisma.md, "Sem autenticação").

create table public.design_systems (
  id                    uuid primary key default gen_random_uuid(),
  titulo                text not null,
  -- Toda a documentação de padding/cor/alinhamento de capa, corpo e CTA vive
  -- aqui como markdown livre — a IA consulta isto como contexto na hora de
  -- gerar o carrossel, não há colunas de estilo separadas de propósito.
  documentacao_markdown text not null default '',
  is_ativo              boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger set_updated_at
  before update on public.design_systems
  for each row execute function public.set_updated_at();

alter table public.design_systems enable row level security;
create policy "design_systems_select_all" on public.design_systems for select using (true);
create policy "design_systems_insert_all" on public.design_systems for insert with check (true);
create policy "design_systems_update_all" on public.design_systems for update using (true) with check (true);
create policy "design_systems_delete_all" on public.design_systems for delete using (true);

grant select, insert, update, delete on public.design_systems to anon, authenticated;

create table public.tons_de_voz (
  id             uuid primary key default gen_random_uuid(),
  nome           text not null,
  descricao      text not null default '',
  exemplo_frase  text not null default '',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger set_updated_at
  before update on public.tons_de_voz
  for each row execute function public.set_updated_at();

alter table public.tons_de_voz enable row level security;
create policy "tons_de_voz_select_all" on public.tons_de_voz for select using (true);
create policy "tons_de_voz_insert_all" on public.tons_de_voz for insert with check (true);
create policy "tons_de_voz_update_all" on public.tons_de_voz for update using (true) with check (true);
create policy "tons_de_voz_delete_all" on public.tons_de_voz for delete using (true);

grant select, insert, update, delete on public.tons_de_voz to anon, authenticated;

-- Node Principal: parâmetros globais do carrossel, adicionados a `criativos`.
alter table public.criativos
  add column design_system_id  uuid references public.design_systems (id) on delete set null,
  add column tom_de_voz_id     uuid references public.tons_de_voz (id) on delete set null,
  add column links_referencia  text[] not null default '{}',
  add column referencias_texto text not null default '',
  -- Versionamento não destrutivo: gerar de novo cria um novo Criativo com
  -- parent_criativo_id apontando pro anterior, que permanece intacto.
  add column version            int not null default 1,
  add column parent_criativo_id uuid references public.criativos (id) on delete set null;

create index criativos_design_system_id_idx on public.criativos (design_system_id);
create index criativos_tom_de_voz_id_idx    on public.criativos (tom_de_voz_id);
create index criativos_parent_criativo_id_idx on public.criativos (parent_criativo_id);

-- Sub-Node de Slide: tipo + campos estruturados por tipo (cover/body/cta) +
-- cópia do texto original (pro botão Reset) + controle de edição/regeneração.
create type public.slide_tipo as enum ('cover', 'body', 'cta');
create type public.slide_image_source as enum ('none', 'uploaded', 'generated');

alter table public.slides
  add column tipo                   public.slide_tipo,
  add column tag_text                text,
  add column headline                text,
  add column subheadline             text,
  add column cta_message             text,
  add column original_texto          text,
  add column original_tag_text       text,
  add column original_headline       text,
  add column original_subheadline    text,
  add column original_cta_message    text,
  add column image_source            public.slide_image_source not null default 'none',
  add column is_texto_editado        boolean not null default false,
  add column is_imagem_editada       boolean not null default false,
  add column regenerar_texto_count   int not null default 0,
  add column regenerar_imagem_count  int not null default 0;

-- Auditoria append-only de edição/regeneração por slide. Sem user_id (sem
-- auth) e sem policy de update/delete — histórico não é editável.
create table public.slide_edit_history (
  id            uuid primary key default gen_random_uuid(),
  slide_id      uuid not null references public.slides (id) on delete cascade,
  action_type   text not null,
  field_changed text,
  old_value     text,
  new_value     text,
  prompt_used   text,
  created_at    timestamptz not null default now()
);

create index slide_edit_history_slide_id_idx on public.slide_edit_history (slide_id);

alter table public.slide_edit_history enable row level security;
create policy "slide_edit_history_select_all" on public.slide_edit_history for select using (true);
create policy "slide_edit_history_insert_all" on public.slide_edit_history for insert with check (true);

grant select, insert on public.slide_edit_history to anon, authenticated;

-- Storage: imagens geradas/upload dos slides. Público e sem policy por
-- pasta de usuário, mesma decisão sem-auth do resto do projeto.
insert into storage.buckets (id, name, public)
values ('carousel-images', 'carousel-images', true)
on conflict (id) do nothing;

create policy "carousel_images_public_read" on storage.objects
  for select using (bucket_id = 'carousel-images');

create policy "carousel_images_public_write" on storage.objects
  for insert with check (bucket_id = 'carousel-images');

-- save_criativo (04_criativos_slides.sql) precisa conhecer as colunas
-- novas pra elas serem persistidas via criativosRepository.ts — redefinida
-- aqui por completo (create or replace), não como ALTER, porque a
-- assinatura de parâmetros não muda, só o corpo.
create or replace function public.save_criativo(p_criativo jsonb, p_slides jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  insert into public.criativos (
    id, tema_id, ideia_id, titulo, status, formato, data_publicacao,
    design_system_id, tom_de_voz_id, links_referencia, referencias_texto,
    version, parent_criativo_id
  )
  values (
    (p_criativo->>'id')::uuid,
    (p_criativo->>'temaId')::uuid,
    nullif(p_criativo->>'ideiaId', '')::uuid,
    p_criativo->>'titulo',
    (p_criativo->>'status')::criativo_status,
    (p_criativo->>'formato')::criativo_formato,
    (p_criativo->>'dataPublicacao')::date,
    nullif(p_criativo->>'designSystemId', '')::uuid,
    nullif(p_criativo->>'tomDeVozId', '')::uuid,
    coalesce(
      (select array_agg(value) from jsonb_array_elements_text(coalesce(p_criativo->'linksReferencia', '[]'::jsonb))),
      '{}'
    ),
    coalesce(p_criativo->>'referenciasTexto', ''),
    coalesce((p_criativo->>'version')::int, 1),
    nullif(p_criativo->>'parentCriativoId', '')::uuid
  )
  on conflict (id) do update set
    tema_id            = excluded.tema_id,
    ideia_id           = excluded.ideia_id,
    titulo             = excluded.titulo,
    status             = excluded.status,
    formato            = excluded.formato,
    data_publicacao    = excluded.data_publicacao,
    design_system_id   = excluded.design_system_id,
    tom_de_voz_id      = excluded.tom_de_voz_id,
    links_referencia   = excluded.links_referencia,
    referencias_texto  = excluded.referencias_texto,
    version            = excluded.version,
    parent_criativo_id = excluded.parent_criativo_id;

  delete from public.slides s
  where s.criativo_id = (p_criativo->>'id')::uuid
    and not exists (
      select 1 from jsonb_array_elements(p_slides) e
      where (e->>'id')::uuid = s.id
    );

  insert into public.slides (
    id, criativo_id, ordem, texto, imagem_url, prompt_texto, prompt_imagem, status,
    tipo, tag_text, headline, subheadline, cta_message,
    original_texto, original_tag_text, original_headline, original_subheadline, original_cta_message,
    image_source, is_texto_editado, is_imagem_editada, regenerar_texto_count, regenerar_imagem_count
  )
  select
    (e->>'id')::uuid,
    (p_criativo->>'id')::uuid,
    (e->>'ordem')::int,
    coalesce(e->>'texto', ''),
    e->>'imagemUrl',
    e->>'promptTexto',
    e->>'promptImagem',
    (e->>'status')::slide_status,
    nullif(e->>'tipo', '')::slide_tipo,
    e->>'tagText',
    e->>'headline',
    e->>'subheadline',
    e->>'ctaMessage',
    e->>'originalTexto',
    e->>'originalTagText',
    e->>'originalHeadline',
    e->>'originalSubheadline',
    e->>'originalCtaMessage',
    coalesce((e->>'imageSource')::slide_image_source, 'none'),
    coalesce((e->>'isTextoEditado')::boolean, false),
    coalesce((e->>'isImagemEditada')::boolean, false),
    coalesce((e->>'regenerarTextoCount')::int, 0),
    coalesce((e->>'regenerarImagemCount')::int, 0)
  from jsonb_array_elements(p_slides) e
  on conflict (id) do update set
    ordem                  = excluded.ordem,
    texto                  = excluded.texto,
    imagem_url             = excluded.imagem_url,
    prompt_texto           = excluded.prompt_texto,
    prompt_imagem          = excluded.prompt_imagem,
    status                 = excluded.status,
    tipo                   = excluded.tipo,
    tag_text               = excluded.tag_text,
    headline               = excluded.headline,
    subheadline            = excluded.subheadline,
    cta_message            = excluded.cta_message,
    original_texto         = excluded.original_texto,
    original_tag_text      = excluded.original_tag_text,
    original_headline      = excluded.original_headline,
    original_subheadline   = excluded.original_subheadline,
    original_cta_message   = excluded.original_cta_message,
    image_source           = excluded.image_source,
    is_texto_editado       = excluded.is_texto_editado,
    is_imagem_editada      = excluded.is_imagem_editada,
    regenerar_texto_count  = excluded.regenerar_texto_count,
    regenerar_imagem_count = excluded.regenerar_imagem_count;
end;
$$;
