-- criativos.tema_id virou opcional (08_node_principal.sql), mas a FK
-- original (01_temas.sql/04_criativos_slides.sql) ainda era "on delete
-- cascade" — excluir um Tema continuaria apagando os Criativos vinculados,
-- o que não faz mais sentido agora que Tema não é mais obrigatório. Troca
-- para "on delete set null": excluir o Tema preserva o Criativo, só solta
-- a referência.
alter table public.criativos
  drop constraint criativos_tema_id_fkey,
  add constraint criativos_tema_id_fkey
    foreign key (tema_id) references public.temas (id) on delete set null;
