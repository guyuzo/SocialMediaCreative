# Plano de Implementação · Social Creative

Baseado em `PRD.md` (produto), `designsystem.md` (visual) e `CLAUDE.md` (stack e regras técnicas). Referências visuais anexadas (dashboard estilo Elementor: sidebar fixa com ícone+label, topbar de busca, grid de cards, avatares empilhados, barra de progresso, grid de "plugins"/marketplace) foram usadas para decidir a estrutura de shell e os padrões de listagem abaixo — tudo isso já está descrito de forma abstrata na seção 10 do `designsystem.md`, aqui eu só aplico a layouts concretos.

**Ordem adaptada ao pedido:** o PRD (seção 11) sugere começar por Temas/Referências/Tarefas sem IA. Você pediu para inverter isso e começar pela parte de **criação e gestão de Criativos**, já preparada para plugar Claude e Gemini depois. O plano abaixo segue essa ordem — a Fase 3 (Temas mínimo) existe só porque Criativos depende de um Tema para existir, não como desvio do pedido.

---

## Decisões técnicas assumidas (ajustável, só avisar se quiser mudar)

| Decisão | Escolha | Motivo |
|---|---|---|
| Linguagem | TypeScript | Tipagem do modelo de dados (Criativo, Slide, Ideia) evita erro bobo na integração com IA depois |
| Roteamento | React Router | Padrão de mercado para SPA com Vite |
| Estado global | Zustand | Leve, sem boilerplate, suficiente pro tamanho do app (single-user, sem auth) |
| Dados nesta fase | Camada de repositório mockada (localStorage + seed JSON) atrás de uma interface | Banco de dados e hospedagem ainda estão "a definir" no PRD (seção 9). Construir a UI contra uma interface de repositório permite trocar por API real depois **sem tocar em nenhum componente de tela** |
| Chaves de API (Claude/Gemini) | Nunca no frontend, nem nesta fase mockada | Regra do PRD (seção 8) — a camada de serviço de IA já nasce com a assinatura de função pronta para um backend, mesmo mockada agora |

---

## Fase 0 · Setup técnico

**Objetivo:** projeto rodando, com o design system já virando código, não só documento.

- `npm create vite@latest` com template React + TypeScript.
- Tailwind CSS configurado; `tailwind.config` recebe os tokens de `designsystem.md` inteiros: cores primitivas e semânticas (claro/escuro/Momentum via `data-theme`), espaçamento (`space-1`…`space-16`), raio (`radius-sm`…`radius-full`), sombra, breakpoints (`sm=375`, `md=768`, `lg=1024`, `xl=1440`), fonte Gilroy com fallback Inter/-apple-system.
- Estrutura de pastas:
  ```
  src/
    components/ui/       -> primitivos reutilizáveis (Fase 1)
    components/layout/   -> AppShell, Sidebar, Topbar, MobileNav (Fase 2)
    features/
      temas/
      criativos/
      ideias/
      referencias/
      ativos/
      agenda/
      tarefas/
    lib/
      repository/         -> interfaces + implementação mock (localStorage)
      ai/                 -> textService, imageService (mockados, Fase 4)
    types/
    routes.tsx
  ```
- React Router com as 8 rotas da seção 5 do PRD (Dashboard, Temas, Biblioteca de Ideias, Referências, Criativos, Ativos, Agenda, Tarefas).
- Toggle de tema (claro/escuro/Momentum) persistido, porque o design system trata os três como cidadãos de primeira classe desde o dia 1.

**Critério de pronto:** app roda, navega entre as 8 rotas (vazias), tema muda e persiste.

---

## Fase 1 · Biblioteca de componentes (design system em código)

Esta é a biblioteca que o `CLAUDE.md` exige consultar antes de criar qualquer componente novo daqui pra frente. Construir tudo aqui, mobile-first, uma vez só:

| Componente | Baseado em (designsystem.md §10) | Variantes |
|---|---|---|
| `Card` | fundo surface, radius-xl, shadow-md/stroke-hairline, padding space-6/space-4 mobile | default, compacto, raised |
| `Button` | botão primário violeta/laranja | primary, secondary, ghost; radius-full ou radius-md |
| `Pill` (filtro) | pílula de filtro | ativa/inativa |
| `Badge` | badge numérico | contagem, dot |
| `Avatar` | avatar circular, empilhável | single, stack (grupo) |
| `AppIcon` | ícone de app quadrado radius-md | tons de marca |
| `ProgressBar` | barra fina radius-full | percentual, cor |
| `Input` / `Textarea` / `Select` | — (novo, segue a mesma linguagem visual) | tamanho sm/md, estado erro |
| `Modal` / `Dialog` | — (novo) | para criar/editar Tema, confirmar exclusão etc. |
| `Tabs` | — (novo) | navegação interna do Criativo (slide 1, 2, 3…) |
| `EmptyState` | — (novo) | "nenhum criativo ainda", reutilizado em todos os módulos |
| `Skeleton` / `Spinner` | — (novo) | estado de carregamento, essencial pra geração de IA depois |
| `Toast` | — (novo) | feedback de ação (salvo, erro de geração) |

Todos com área de toque mínima 44x44px no mobile e breakpoints do design system.

**Critério de pronto:** Storybook simples ou uma rota `/dev/components` mostrando cada um com suas variantes — serve de catálogo vivo pra "verificar se já existe" antes de criar componente novo.

---

## Fase 2 · App Shell (layout responsivo)

- Desktop: sidebar fixa à esquerda (ícone + label, 8 itens da IA da seção 5), topbar com busca, área de conteúdo rolável à direita — layout de duas colunas do PRD (seção 4).
- Mobile: sidebar vira navegação inferior fixa (bottom nav) com os itens mais usados (Dashboard, Criativos, Ideias, Agenda) + um "mais" que abre os restantes num drawer — decisão de UI que o PRD deixou em aberto, resolvida aqui a favor de bottom nav porque é o padrão mobile mais usado e mantém área de toque de 44px sem espremer texto.
- Usa `Card`, `Avatar`, `AppIcon`, `Badge` da Fase 1 — nada de CSS solto novo.

**Critério de pronto:** shell responsivo funcional em 375/768/1024/1440px, navegação entre módulos ok.

---

## Fase 3 · Temas — fundação mínima

Só o necessário pra um Criativo ter contexto (dependência direta da Fase 4):

- CRUD de Tema: nome, cor/ícone, descrição curta.
- Cada Tema é um contêiner isolado (id próprio).
- Listagem em grid de `Card`, sem funcionalidade avançada ainda (biblioteca de ideias/referências dentro do tema fica pra Fase 5/6).

**Critério de pronto:** criar, editar, excluir Tema; Tema aparece como opção de seleção em outros módulos.

---

## Fase 4 · Criativos — criação e gestão (prioridade do pedido)

### 4.1 Modelo de dados

```ts
type SlideStatus = 'vazio' | 'gerando' | 'gerado' | 'editado' | 'erro'

type Slide = {
  id: string
  ordem: number
  texto: string
  imagemUrl?: string
  promptTexto?: string   // prompt usado na geração, guardado pro histórico
  promptImagem?: string
  status: SlideStatus
}

type CriativoStatus = 'rascunho' | 'pronto' | 'agendado' | 'publicado'

type Criativo = {
  id: string
  temaId: string
  ideiaId?: string        // opcional: pode nascer "em branco"
  titulo: string
  status: CriativoStatus
  formato: '4:5' | '1:1'   // default 4:5 conforme referência de carrossel Instagram
  slides: Slide[]
  createdAt: string
  updatedAt: string
}
```

### 4.2 Listagem de Criativos
- Grid de `Card` (reaproveitado da Fase 1), filtro por Tema e por Status usando `Pill`.
- `EmptyState` quando não há criativos ainda.

### 4.3 Criação/edição — editor de carrossel
- Criar "em branco" (só escolhendo Tema) — a origem por Ideia entra de verdade na Fase 5.
- Navegação entre slides via `Tabs`.
- Por slide: painel de texto (editável manualmente) + painel de imagem (preview + botão "Gerar com IA").
- Adicionar/remover/reordenar slide, limite configurável (default: mínimo 3, máximo 10 slides).
- Preview final do carrossel no formato 4:5.

### 4.4 Camada de IA — preparada, não conectada ainda
Isso é o "já deixa preparado" que você pediu:

```ts
// src/lib/ai/textService.ts
interface TextGenerationService {
  generateSlideText(input: { tema: string; contexto?: string; slideIndex: number }): Promise<string>
}
// implementação mock agora (retorna texto placeholder com delay simulado),
// trocada por chamada real à API Claude via backend na Fase 10 — assinatura não muda.

// src/lib/ai/imageService.ts
interface ImageGenerationService {
  generateSlideImage(input: { prompt: string; formato: '4:5' | '1:1' }): Promise<{ url: string }>
}
// mock agora, trocado por Gemini/Nano Banana na Fase 10.
```

- UI já reflete os estados reais de uma chamada assíncrona: `Spinner` durante `gerando`, erro com opção de retry, resultado editável depois de gerado.
- `.env.example` documentando `ANTHROPIC_API_KEY` e `GEMINI_API_KEY` — só como documentação, já que essas chaves só vão existir num backend (Fase 10), nunca no bundle do frontend.

### 4.5 Estado e ações
- Transições manuais de status (rascunho → pronto → agendado → publicado), sem automação.
- Duplicar Criativo, excluir, exportar/baixar imagens geradas.

**Critério de pronto:** dá pra criar um Criativo do zero, editar texto e "gerar" imagem/texto mockado por slide, ver preview do carrossel, e mudar status — tudo já na estrutura que vai receber IA real sem refatoração.

---

## Fase 5 · Biblioteca de Ideias

- Fecha o loop Ideia → Criativo que o PRD descreve (fluxo principal, seção 7).
- Ideia: título, resumo, Tema de origem. Ações: descartar, editar, "promover para Criativo" (pré-preenche `ideiaId` e título ao criar o Criativo da Fase 4).
- Geração de Ideia via IA reaproveita o mesmo `TextGenerationService` da Fase 4 (mockado ainda).

## Fase 6 · Referências

- Colar URL → extração de conteúdo (mock/stub nesta fase; a extração real é trabalho de backend, tratado junto da Fase 10 ou depois).
- Cadastro de sites recorrentes e anotação livre, tudo amarrado a um Tema.
- Nota do PRD (seção 6.2): busca dentro de domínios cadastrados é feature maior, fica isolada como Fase 12 (ver abaixo), não entra aqui.

## Fase 7 · Ativos

- Biblioteca central de mídia: imagens geradas em Criativos caem aqui automaticamente, mais upload manual.
- Reaproveita `Card` em grid + `Modal` de preview.

## Fase 8 · Agenda

- Calendário simples (mês/semana), marca dia de publicação de um Criativo já "pronto". Sem publicação automática.

## Fase 9 · Tarefas

- Checklist independente: criar, editar, concluir, excluir. Módulo mais simples do sistema, feito por último de propósito (zero dependência).

---

## Fase 10 · Integração real de IA + backend mínimo

- Backend leve (endpoint proxy) só para esconder as chaves e chamar Claude (texto) e Gemini/Nano Banana (imagem).
- Troca as implementações mock de `textService`/`imageService` pela chamada HTTP real — como a Fase 4 já isolou tudo atrás da interface, a tela de Criativos não muda.
- Necessário decidir aqui: `gemini-2.5-flash-image` vs `gemini-3.1-flash-image` (custo x qualidade, ponto em aberto no PRD seção 8).

## Fase 11 · Persistência real e hospedagem

- Troca o repositório mock (localStorage) por API real + banco (Postgres é o caminho sugerido no PRD seção 9).
- Decisão de hospedagem e exposição pública (sistema ainda sem login — PRD seção 10 lista isso como ponto em aberto, relevante aqui por causa do custo de geração de IA sem controle de acesso).

## Fase 12 · Busca em sites cadastrados

- Feature isolada e mais cara (PRD seção 6.2 e 11): camada de busca/crawler restrita aos domínios cadastrados em Referências. Fica por último de propósito.

---

## Resumo da ordem

`Setup → Componentes → Shell → Temas (mínimo) → Criativos (completo, IA mockada) → Ideias → Referências → Ativos → Agenda → Tarefas → IA real + backend → Persistência/Hospedagem → Busca por domínio`

Cada fase só usa componentes já existentes da Fase 1 antes de propor um novo — se um componente novo surgir no meio do caminho (ex: `Tabs` só nasce necessário na Fase 4), ele volta pra biblioteca da Fase 1 e fica disponível pras fases seguintes.
