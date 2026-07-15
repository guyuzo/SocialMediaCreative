# Design System · Base Visual

Documento de fundação estética, extraído das imagens de referência. Aqui só entram cores, tipografia, formas e efeitos. Funcionalidade do sistema de posts fica para depois.

## 1. Conceito visual

A referência mistura dois mundos: painéis de SaaS modernos (tipo Elementor) e uma estética "Apple", limpa e com muito espaço vazio. Cinco ideias sustentam isso:

**Cartão como unidade base.** Quase tudo vive dentro de um retângulo de canto bem arredondado, fundo sólido ou levemente translúcido, sombra suave. Nada fica solto na tela.

**Um acento de cor, o resto neutro.** Cada tema usa uma cor forte só (violeta no modo claro/escuro, laranja no tema Momentum) contra um fundo quase monocromático. A cor nunca compete com ela mesma.

**Peso tipográfico como hierarquia.** A fonte (Gilroy, geométrica, parente de família da SF Pro da Apple) varia de peso extra leve a extra pesado. Título pesado, corpo regular, legenda leve. Não se usa tamanho grande para tudo, usa-se peso.

**Profundidade sem ruído.** Sombra difusa e de baixa opacidade no modo claro. No escuro, quase nenhuma sombra, a profundidade vem de tons de cinza empilhados e, no tema Momentum, de brilho (glow) colorido.

**Modo claro e escuro como cidadãos de primeira classe.** As telas mostram o mesmo layout inteiro migrado para dark mode sem perder hierarquia. Isso significa que todo token de cor precisa ter par claro/escuro definido desde já.

## 2. Tipografia

**Família:** Gilroy (geométrica, sem serifa). Se não estiver disponível na web, fallback para Inter ou -apple-system, que têm espírito parecido.

```
font-family: 'Gilroy', -apple-system, 'Inter', system-ui, sans-serif;
```

### Pesos (primitivos)

| Token | Peso | Uso |
|---|---|---|
| `font-weight-light` | 300 | textos legenda, subtítulos discretos |
| `font-weight-regular` | 400 | corpo de texto, alfabeto minúsculo |
| `font-weight-medium` | 500 | labels, itens de menu |
| `font-weight-semibold` | 600 | subtítulos de card, nomes |
| `font-weight-bold` | 700 | títulos de seção ("Typography", "Dashboard") |
| `font-weight-black` | 800-900 | número/destaque grande (o "Aa" duplicado) |

### Escala de tamanho (primitivos)

| Token | Valor | Uso |
|---|---|---|
| `font-size-xs` | 12px | legendas, timestamps |
| `font-size-sm` | 14px | corpo secundário, itens de lista |
| `font-size-base` | 16px | corpo padrão |
| `font-size-md` | 18px | subtítulo de card |
| `font-size-lg` | 24px | título de seção |
| `font-size-xl` | 32px | número de destaque (ex: "1.892") |
| `font-size-2xl` | 48px | título de página |
| `font-size-display` | 96px+ | letra gigante decorativa (o "Aa") |

Line-height padrão: 1.4 para corpo, 1.1 para títulos grandes e números de destaque.

## 3. Cores primitivas

Valores brutos, sem função ainda atribuída.

### Neutros

| Token | Hex | Nota |
|---|---|---|
| `gray-0` | `#FFFFFF` | branco puro, superfícies claras |
| `gray-50` | `#F6F7FB` | fundo de app no modo claro |
| `gray-100` | `#EEEFF4` | fundo de input, hover sutil |
| `gray-200` | `#E2E4EC` | bordas claras, divisores |
| `gray-400` | `#9CA0AF` | texto secundário no claro |
| `gray-600` | `#6B6F7D` | texto terciário |
| `gray-800` | `#232329` | superfície de card no escuro |
| `gray-900` | `#17171B` | fundo de app no modo escuro |
| `gray-950` | `#0D0D10` | fundo mais profundo (hero, imagem grande) |

### Acento violeta (tema principal)

| Token | Hex |
|---|---|
| `violet-100` | `#EDEBFF` |
| `violet-300` | `#A79BFF` |
| `violet-500` | `#6C5CE7` |
| `violet-600` | `#5B4BD9` |
| `violet-700` | `#4A3DB8` |

### Acento laranja (tema Momentum)

| Token | Hex |
|---|---|
| `orange-100` | `#FFE4D1` |
| `orange-300` | `#FFAD73` |
| `orange-500` | `#FF6B1A` |
| `orange-600` | `#E85A0C` |
| `orange-900` | `#3A1D0D` |

### Cores de apoio (gráficos, status, badges)

| Token | Hex | Uso observado |
|---|---|---|
| `pink-500` | `#FF4D8D` | linha do gráfico de receita |
| `blue-500` | `#3B5BDB` | cartão de crédito, gráfico de barras |
| `green-500` | `#34C759` | indicador de crescimento (+0.3%) |
| `red-500` | `#FF3B30` | badge de notificação |
| `yellow-500` | `#FFC93C` | ícone de app (Mailchimp) |

## 4. Cores semânticas

Aqui os primitivos ganham função. Cada linha tem o par claro/escuro.

### Modo claro

| Token semântico | Valor | Primitivo |
|---|---|---|
| `color-bg-app` | `#F6F7FB` | gray-50 |
| `color-bg-surface` | `#FFFFFF` | gray-0 |
| `color-bg-surface-raised` | `#FFFFFF` + sombra | gray-0 |
| `color-border-subtle` | `#E2E4EC` | gray-200 |
| `color-text-primary` | `#17171B` | gray-900 |
| `color-text-secondary` | `#6B6F7D` | gray-600 |
| `color-text-muted` | `#9CA0AF` | gray-400 |
| `color-accent-primary` | `#6C5CE7` | violet-500 |
| `color-accent-primary-hover` | `#5B4BD9` | violet-600 |
| `color-accent-soft` | `#EDEBFF` | violet-100 |
| `color-success` | `#34C759` | green-500 |
| `color-danger` | `#FF3B30` | red-500 |

### Modo escuro

| Token semântico | Valor | Primitivo |
|---|---|---|
| `color-bg-app` | `#17171B` | gray-900 |
| `color-bg-surface` | `#232329` | gray-800 |
| `color-bg-surface-raised` | `#2A2A32` | entre gray-800 e gray-700 |
| `color-border-subtle` | `#33333D` | gray-800 + 10% luz |
| `color-text-primary` | `#F5F5F7` | quase gray-0 |
| `color-text-secondary` | `#9C9CA6` | gray-400 ajustado |
| `color-text-muted` | `#6B6B76` | gray-600 ajustado |
| `color-accent-primary` | `#7C6CFF` | violet-500 clareado p/ contraste |
| `color-accent-soft` | `#2A2450` | violet escurecido |
| `color-success` | `#34C759` | mesmo do claro |
| `color-danger` | `#FF453A` | vermelho ajustado p/ escuro |

### Tema alternativo (Momentum, laranja, sempre escuro)

| Token semântico | Valor |
|---|---|
| `color-bg-app` | gradiente `#1A1410` → `#0D0B09` |
| `color-bg-surface` | `rgba(255,255,255,0.05)` sobre o fundo (glass) |
| `color-accent-primary` | `#FF6B1A` |
| `color-text-primary` | `#FFF6EF` |
| `color-glow` | `#FF6B1A` com blur grande, opacidade baixa |

## 5. Espaçamento

Unidade base de 4px, escala geométrica simples.

| Token | Valor |
|---|---|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |

Padding interno de card: `space-6` (24px) como padrão, `space-4` (16px) em card compacto ou mobile.

## 6. Raio (border-radius)

Cantos bem arredondados são a assinatura mais forte do estilo.

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | 8px | inputs pequenos, chips |
| `radius-md` | 12px | botões, ícones de app |
| `radius-lg` | 16px | cards internos, gráficos |
| `radius-xl` | 20px | cards principais |
| `radius-2xl` | 24px | painel grande, hero |
| `radius-full` | 9999px | pílulas (filtros, botão "Connect"), avatares |

## 7. Bordas e strokes

No modo claro, quase não existe borda visível, a separação vem de sombra. No modo escuro, a borda de 1px é o que separa um card do fundo, já que a sombra some.

| Token | Valor |
|---|---|
| `stroke-hairline` | 1px |
| `stroke-color-light` | `color-border-subtle` (claro) |
| `stroke-color-dark` | `color-border-subtle` (escuro), levemente mais visível |
| `stroke-focus` | 2px, cor `color-accent-primary` |

Ícones de linha (menu lateral, ações) usam stroke de 1.5px a 2px, cantos levemente arredondados.

## 8. Sombra e elevação

| Token | Valor | Uso |
|---|---|---|
| `shadow-xs` | `0 1px 2px rgba(16,24,40,0.04)` | hover em item de lista |
| `shadow-sm` | `0 2px 8px rgba(16,24,40,0.06)` | card pequeno |
| `shadow-md` | `0 8px 24px rgba(16,24,40,0.08)` | card principal, modal |
| `shadow-lg` | `0 16px 40px rgba(16,24,40,0.12)` | elemento flutuante, dropdown |
| `shadow-glow-accent` | `0 0 60px rgba(255,107,26,0.35)` | brilho do tema Momentum |

No modo escuro, sombra praticamente não é usada. Elevação vem de `color-bg-surface-raised` (um tom mais claro que o fundo) combinada com `stroke-hairline`.

## 9. Efeitos especiais

**Glass (vidro fosco):** superfície semitransparente com blur de fundo, usada no tema Momentum.
```
background: rgba(255,255,255,0.05);
backdrop-filter: blur(20px);
border: 1px solid rgba(255,255,255,0.08);
```

**Glow (brilho):** mancha de cor com blur grande atrás de um elemento central, dá sensação de energia. Visto no card "Maximize human productivity".

**Duotone / contorno duplicado:** no cartão de tipografia, a letra "Aa" aparece duas vezes, uma sólida e uma só com contorno, levemente deslocada. É um recurso decorativo para hero de seção, não para uso repetido em UI funcional.

**Gradiente em cartão:** o cartão de débito usa gradiente diagonal azul escuro, do canto superior esquerdo pro inferior direito. Cartões promocionais (o coral) usam o mesmo princípio em tom quente.

## 10. Padrões de componente (nível estético, não funcional)

**Card:** fundo `color-bg-surface`, `radius-xl`, `shadow-md` (claro) ou `stroke-hairline` (escuro), padding `space-6`.

**Botão primário:** fundo `color-accent-primary`, texto branco, `radius-full` ou `radius-md`, peso `font-weight-semibold`.

**Pílula de filtro:** `radius-full`, fundo `color-accent-soft` quando inativa, fundo `color-accent-primary` com texto branco quando ativa.

**Badge numérico:** círculo pequeno, fundo `color-danger`, texto branco, `font-size-xs`, `font-weight-bold`.

**Avatar:** sempre círculo (`radius-full`), borda opcional de 2px branca quando empilhado com outros.

**Ícone de app:** quadrado com `radius-md`, fundo em tom suave da cor da marca, ícone centralizado.

**Barra de progresso:** trilho em `color-bg-surface` ou `gray-100`, preenchimento colorido, altura fina (4-6px), cantos `radius-full`.

## 11. Breakpoints (fundação para responsividade)

Só os tokens de ponto de quebra. Como o layout vai se comportar em cada um fica para a etapa de funcionalidade.

| Token | Largura mínima | Referência |
|---|---|---|
| `breakpoint-sm` | 375px | celular |
| `breakpoint-md` | 768px | tablet |
| `breakpoint-lg` | 1024px | notebook |
| `breakpoint-xl` | 1440px | desktop grande |

Área de toque mínima recomendada para qualquer elemento clicável no mobile: 44px por 44px (padrão Apple HIG), relevante desde já porque afeta o tamanho mínimo de botões e ícones definidos acima.

---

Próximo arquivo (futuro): design system específico da tela de criação de posts, construído em cima destes tokens.
