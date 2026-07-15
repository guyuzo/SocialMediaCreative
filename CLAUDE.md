# CLAUDE.md

Instruções de desenvolvimento para o projeto **Social Creative** (ver `PRD.md` e `designsystem.md`).

## Stack

- **React** + **Vite** como base do projeto.
- **Tailwind CSS** para estilização. Tokens de cor, espaçamento, raio e tipografia devem ser mapeados para o `tailwind.config` a partir do que já está definido em `designsystem.md` — não inventar valores soltos fora da escala documentada lá.

## Responsividade (mobile first)

- Todo componente e toda tela são construídos primeiro para mobile, depois expandidos para telas maiores com os breakpoints do Tailwind (`sm`, `md`, `lg`, `xl`), alinhados aos breakpoints já definidos em `designsystem.md` (375px, 768px, 1024px, 1440px).
- O sistema precisa ser 100% adaptável: nenhuma tela pode depender de layout fixo que quebre fora do breakpoint desktop.
- Área de toque mínima de 44x44px em qualquer elemento clicável no mobile (já especificado no design system).

## Componentização

- O sistema é construído em componentes React reutilizáveis, nunca em blocos de página monolíticos.
- **Antes de criar um componente novo, verificar se já existe um equivalente na biblioteca de componentes do projeto.** Se existir, reaproveitar (via props/variantes) em vez de duplicar. Só criar um componente novo quando nenhum existente cobrir o caso.
- Objetivo direto dessa regra: economizar tokens e evitar código duplicado/inconsistente entre telas.
