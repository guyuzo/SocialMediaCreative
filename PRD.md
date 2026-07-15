# PRD · Social Creative

Versão 0.1 · 14/07/2026

## 1. O que é

Social Creative é um sistema para criar posts de redes sociais (foco inicial em carrossel de Instagram) a partir de um processo estruturado: você organiza o assunto por categoria, acumula referências e ideias dentro dela, e o sistema ajuda a transformar isso em conteúdo pronto, texto e imagem.

A ideia central é reduzir a distância entre "vi algo interessante" e "postei um carrossel sobre isso". O sistema guarda o material bruto (notícias, sites, ideias soltas), organiza por tema, e usa IA para gerar tanto o texto quanto a imagem de cada slide.

Por enquanto, sem funcionalidade de publicação automática, sem login, um único usuário usando o sistema aberto.

## 2. Problema

Criar conteúdo consistente para redes sociais exige três coisas que normalmente ficam espalhadas em lugares diferentes: onde guardar referência, onde organizar ideia, e onde produzir o conteúdo final. Social Creative junta as três em um só lugar, com IA fazendo a ponte entre referência e conteúdo pronto.

## 3. Fora de escopo nesta fase

- Autenticação e múltiplos usuários
- Publicação automática nas redes (o sistema gera o conteúdo, não posta sozinho)
- Métricas de desempenho de post (curtidas, alcance)
- Aplicativo mobile nativo (o sistema é web responsivo, não um app)

## 4. Layout geral

Estrutura fixa de duas colunas:

- **Coluna esquerda (sidebar):** navegação principal, fixa, não rola. Ícones + labels dos módulos.
- **Coluna direita (conteúdo):** área de trabalho, essa sim rola verticalmente. Tudo que muda de acordo com o módulo selecionado aparece aqui.

No mobile, a sidebar vira navegação inferior ou menu retrátil (a decidir na etapa de UI, o design system já prevê breakpoints para isso).

Segue o `designsystem.md` já definido: cards de canto arredondado, cor de acento única por tema, tipografia Gilroy, modo claro e escuro.

## 5. Arquitetura de informação (proposta)

Você me passou quatro abas certas (Ativos, Criativos, Agenda, Tarefas) mas o fluxo que você descreveu (categoria -> ideia -> referência -> conteúdo) precisa de um lugar próprio na navegação. Não dá pra empurrar tudo isso dentro de "Criativos" sem confundir. Proposta de sidebar:

| Item | Função |
|---|---|
| Dashboard | Visão geral: últimas ideias, próximos posts na agenda, tarefas pendentes |
| Temas | Lista de categorias, criar/editar/excluir categoria |
| Biblioteca de Ideias | Ideias geradas ou anotadas dentro de cada tema |
| Referências | O "cérebro": links, notícias, materiais colados por categoria |
| Criativos | Conteúdo gerado (carrosséis), rascunho até finalizado |
| Ativos | Arquivos e imagens usados ou gerados, banco de mídia |
| Agenda | Calendário de quando cada post vai ser publicado |
| Tarefas | Checklist livre, criar/editar/excluir tarefa |

Se preferir, dá para dobrar Temas e Biblioteca de Ideias em uma coisa só (você entra no tema e já vê as ideias dentro). Deixei separado na proposta porque acho mais fácil de navegar, mas essa é uma decisão sua, não técnica.

## 6. Módulos

### 6.1 Temas (categorias)

- Criar, editar, renomear e excluir categoria livremente.
- Cada categoria é um contêiner isolado: tem sua própria biblioteca de ideias e suas próprias referências.
- Campos mínimos por categoria: nome, cor ou ícone de identificação, descrição curta (contexto que a IA vai usar depois).

### 6.2 Referências (o cérebro)

Este é o módulo que alimenta a IA com contexto real, em vez de ela inventar do zero.

- Colar uma URL (notícia, site, post) e o sistema extrai o conteúdo relevante daquela página.
- Cadastrar sites de referência recorrentes, para que o sistema possa pesquisar neles quando for gerar uma ideia nova.
- Anotação livre também entra aqui (brainstorm solto, sem vir de link nenhum).
- Tudo isso fica amarrado a uma categoria específica.

Ponto de atenção: "pesquisar de acordo com os sites que a gente passar" é uma funcionalidade de busca dentro de domínios específicos. Isso é mais complexo que só ler uma URL colada, precisa de uma camada de busca (crawler ou API de busca restrita a domínio). Vale tratar como uma fase separada dentro do desenvolvimento, não como o mesmo esforço que "colar link e extrair texto".

### 6.3 Biblioteca de Ideias

- A partir do material em Referências (ou sem ele, só com o nome da categoria), a IA sugere ideias de conteúdo.
- Cada ideia é um item curto: título, resumo, categoria de origem.
- Ideia pode ser descartada, editada, ou promovida para virar um Criativo.

### 6.4 Criativos (geração de conteúdo)

- A partir de uma ideia, o sistema gera uma sequência de carrossel: texto de cada slide (via API da Claude) e imagem de cada slide (via API do Gemini, modelo de imagem conhecido como Nano Banana).
- Cada criativo guarda o histórico: ideia de origem, texto gerado, imagens geradas, versão editada manualmente se houver.
- Estado do criativo: rascunho, pronto, agendado, publicado (esse último é manual, marcado por você mesmo, já que não tem publicação automática).

### 6.5 Ativos

- Biblioteca central de mídia: imagens geradas, imagens enviadas manualmente, arquivos usados como referência visual.
- Serve tanto para reaproveitar imagem em outro criativo quanto para guardar o resultado final antes de baixar.

### 6.6 Agenda

- Calendário simples: arrasta ou marca em que dia cada Criativo vai ser publicado.
- Não publica sozinho, é só planejamento visual.

### 6.7 Tarefas

- Checklist independente do resto do fluxo de conteúdo.
- Criar, editar, marcar como feita, excluir. Sem prazo automático nem dependência com os outros módulos, a não ser que você queira isso numa fase futura.

## 7. Fluxo principal (fim a fim)

1. Você cria ou seleciona um Tema.
2. Adiciona Referências àquele tema (cola um link, cadastra um site, ou escreve uma anotação solta).
3. Pede pro sistema gerar Ideias com base nesse material.
4. Escolhe uma Ideia e transforma em Criativo.
5. Sistema gera o texto de cada slide (Claude) e a imagem de cada slide (Gemini/Nano Banana).
6. Você revisa, edita o que quiser, e marca o Criativo como pronto.
7. Marca na Agenda o dia da publicação.
8. Publica manualmente fora do sistema e, se quiser, marca como publicado.

## 8. Integrações de IA

| Uso | Provedor | Observação |
|---|---|---|
| Geração de texto (ideias, legendas, texto de slide) | API da Anthropic (Claude) | Modelo sugerido: Claude Sonnet 5 (`claude-sonnet-5`), bom equilíbrio de custo e qualidade para geração de texto em produção |
| Geração de imagem (slides do carrossel) | API do Google (Gemini) | Modelo conhecido como "Nano Banana" (`gemini-2.5-flash-image`). Existe uma versão mais nova, Nano Banana 2 (`gemini-3.1-flash-image`), com melhor qualidade e custo mais alto, vale comparar antes de travar a escolha |
| Busca em sites de referência | A definir | Para a função de "pesquisar dentro dos sites cadastrados" vai precisar de uma API de busca ou scraper, ainda não escolhida |

Ambas as chaves de API (Claude e Gemini) precisam ficar no backend, nunca expostas no navegador.

## 9. Dados e infraestrutura

Pontos que você mesmo deixou em aberto, listando aqui pra não perder:

- **Banco de dados:** a definir. Dado o tipo de conteúdo (texto estruturado, categorias, relações entre ideia e criativo, mais arquivos de mídia), um banco relacional (Postgres) com um storage de arquivo à parte para as imagens é o caminho mais direto.
- **Hospedagem/deploy:** a definir, sua frase ficou incompleta ("vamos publicar o nosso projeto na...").
- **Autenticação:** nenhuma nesta fase. Sistema aberto. Vale já pensar se em algum momento isso muda, porque afeta a escolha de hospedagem (sistema aberto na internet pública é diferente de sistema atrás de senha).

## 10. Pontos que merecem decisão antes de começar a construir

- Busca em sites de referência: como vai funcionar de verdade (scraper próprio, API de busca, ou só leitura de link colado por enquanto, deixando busca por domínio pra depois)?
- Sistema sem autenticação vai ficar acessível publicamente na internet ou só rodando local/rede interna? Isso muda o risco de expor as chaves de API e o custo de geração (qualquer um podendo gerar imagem consome sua cota).
- Limite de geração: vai ter algum controle de quanto se gasta em chamada de API por dia/mês, ou geração livre?
- Estrutura de carrossel: quantos slides por padrão, tem um limite, o formato de imagem é fixo (quadrado, 4:5)?

## 11. Fases sugeridas

1. **Fundação:** estrutura de Temas, Referências (só link colado, sem busca por domínio ainda) e Tarefas. Sem IA ainda, só CRUD.
2. **Geração de ideia e texto:** integrar Claude para gerar Ideias e texto de Criativo a partir das Referências.
3. **Geração de imagem:** integrar Gemini/Nano Banana para gerar as imagens do carrossel.
4. **Agenda e Ativos:** calendário de publicação e biblioteca de mídia centralizada.
5. **Busca em sites cadastrados:** camada de busca por domínio, feature mais cara de construir, fica por último.

---

Baseado no `designsystem.md` já criado. Próximo passo natural, depois de você validar esse PRD, é decidir banco de dados e hospedagem antes de começar a estrutura técnica.
