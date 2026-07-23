-- Ajustes ao Node Principal (Criativo) pedidos junto do mockup do card:
-- Tema deixa de ser obrigatório no fluxo de Criativos (o card de criação não
-- tem mais campo de Tema — decisão do usuário) e ganha um campo de
-- Descrição (contexto geral da campanha, também usado como input pra IA).
-- Ver esquema-prisma.md e supabase/schemas/07_nodes.sql.

alter table public.criativos
  alter column tema_id drop not null,
  add column descricao text not null default '';

create or replace function public.save_criativo(p_criativo jsonb, p_slides jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  insert into public.criativos (
    id, tema_id, ideia_id, titulo, descricao, status, formato, data_publicacao,
    design_system_id, tom_de_voz_id, links_referencia, referencias_texto,
    version, parent_criativo_id
  )
  values (
    (p_criativo->>'id')::uuid,
    nullif(p_criativo->>'temaId', '')::uuid,
    nullif(p_criativo->>'ideiaId', '')::uuid,
    p_criativo->>'titulo',
    coalesce(p_criativo->>'descricao', ''),
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
    descricao          = excluded.descricao,
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
