-- Extensão para gen_random_uuid() e trigger compartilhado de updated_at.
-- Ver esquema-prisma.md para a documentação completa do modelo de dados.
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
