# May Salon · Site institucional

Site do **May Salon**, salão de beleza premium em Inhumas (GO).
React 18 + TypeScript + Vite, Tailwind CSS, Framer Motion, Lenis (scroll suave), React Router v6, Lucide e React Helmet Async.

## Rodando localmente

Requisitos: Node 18.18 ou superior (recomendado Node 20+).

```bash
npm install
npm run dev        # http://localhost:5173
```

Outros scripts:

| Script              | O que faz                                        |
| ------------------- | ------------------------------------------------ |
| `npm run build`     | Checa os tipos (tsc) e gera o build em `dist/`   |
| `npm run preview`   | Serve o build de produção localmente             |
| `npm run typecheck` | Só a checagem de tipos                           |

## Como fazer deploy

O projeto já está pronto para a **Vercel** (plano gratuito atende).

1. **Suba o código para o GitHub.** Crie um repositório e envie esta pasta (o `.gitignore` já ignora `node_modules` e `dist`).
2. **Importe na Vercel.** Em [vercel.com](https://vercel.com), entre com o GitHub e clique em **Add New → Project**. Escolha o repositório.
3. **Confira as configurações.** A Vercel detecta Vite sozinha: build `npm run build`, saída `dist`. Não precisa mudar nada.
4. **Configure o formulário de contato** (obrigatório antes de divulgar o site). Em **Settings → Environment Variables**, crie
   `VITE_CONTACT_ENDPOINT` com o endereço que vai receber as mensagens (veja [Formulário de contato](#formulário-de-contato)). Depois, faça um novo deploy.
5. **Clique em Deploy.** Em cerca de 1 minuto o site está no ar num endereço `*.vercel.app`.
6. **Ligue o domínio.** Em **Settings → Domains**, adicione `maysalon.com.br` (ou o domínio escolhido) e siga as instruções de DNS da Vercel.
7. **Atualize `site.url`** em `src/config/site.ts` com o domínio definitivo e publique de novo. Ele alimenta as URLs canônicas, o Open Graph, o JSON-LD, o `sitemap.xml` e o `robots.txt`.
8. **Avise o Google.** No [Google Search Console](https://search.google.com/search-console), adicione o domínio e envie `https://SEU-DOMINIO/sitemap.xml`.
9. **Teste as prévias.** Cole `https://SEU-DOMINIO/servicos` no [Sharing Debugger do Facebook](https://developers.facebook.com/tools/debug/) (o WhatsApp usa o mesmo padrão Open Graph): o título precisa ser "Serviços · May Salon Inhumas". No terminal: `curl -s https://SEU-DOMINIO/servicos | grep og:title`.

Detalhes que já estão resolvidos:

- O `vercel.json` manda cada página para o próprio HTML (`/servicos` → `servicos/index.html`, com a prévia certa) e todo o resto para `index.html`, então qualquer rota do React Router abre direto e resiste ao F5.
- Arquivos de `/assets` recebem cache de 1 ano (os nomes mudam a cada build).
- Cada `git push` na branch principal publica sozinho; cada pull request ganha um link de prévia.

### GitHub Pages

O repositório já vem com um workflow pronto (`.github/workflows/deploy.yml`): a cada `git push` na
branch `main`, ele builda o site e publica em `[https://SEU-USUARIO.github.io/NOME-DO-REPO/](https://mayconxis.github.io/LandingPageMaySalon/)`. Só falta
um passo manual, feito uma única vez:

1. No GitHub, vá em **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **GitHub Actions**.
3. Dê `git push` (ou rode o workflow manualmente na aba **Actions**). Em 1 a 2 minutos o site sobe.

Como o GitHub Pages serve o site num subcaminho (`/NOME-DO-REPO/`, não na raiz), o build detecta a
variável `GITHUB_PAGES` (setada só pelo workflow) e ajusta o `base` do Vite e as rotas do React Router
automaticamente; localmente e na Vercel nada muda. Se quiser publicar num domínio próprio pelo GitHub
Pages, crie um arquivo `public/CNAME` com o domínio e reveja o `base` em `vite.config.ts` (nesse caso
ele deve voltar a ser `/`, já que o domínio próprio serve da raiz).

O formulário de contato segue a mesma regra da Vercel: sem o secret `VITE_CONTACT_ENDPOINT` (em
**Settings → Secrets and variables → Actions**), o envio fica simulado

### Formulário de contato

⚠️ **Sem `VITE_CONTACT_ENDPOINT`, o envio é simulado:** a pessoa vê "Mensagem enviada!", mas nada chega ao salão.
Qualquer serviço que aceite `POST` com JSON funciona. Opções simples:

- **[Formspree](https://formspree.io)**: crie um formulário e use a URL `https://formspree.io/f/XXXXXXX`. As mensagens chegam por e-mail.
- **[Web3Forms](https://web3forms.com)**: gratuito, também entrega por e-mail.
- Uma função própria na Vercel (`/api/contato`), se preferir guardar as mensagens em outro lugar.

O corpo enviado é `{ nome, email, servico, mensagem, origem }` (código em `src/lib/contato.ts`).
Em `npm run dev`, um aviso discreto abaixo do formulário lembra quando o envio está simulado.

## Onde ficam os dados do negócio

| Arquivo                   | O que tem                                                                       |
| ------------------------- | ------------------------------------------------------------------------------- |
| `src/config/site.ts`      | WhatsApp, telefone, Instagram, endereço, horários, domínio, imagem de compartilhamento, menu e rodapé |
| `src/config/seo.ts`       | Título e descrição de cada página                                               |
| `src/data/servicos.ts`    | **Fonte única dos serviços** (Home, /servicos, agendamento, equipe e formulário) |
| `src/data/mockData.ts`    | **Só a equipe** (fictícia enquanto `MOCK_DATA = true`) e os helpers dela        |
| `src/data/depoimentos.ts` | Depoimentos do carrossel da Home (`ilustrativo: true` mostra o aviso)           |
| `src/data/stats.ts`       | Números da faixa de prova social da Home                                        |
| `src/data/faq.ts`         | Perguntas frequentes de /servicos                                               |
| `src/data/galeria.ts`, `transformacoes.ts` | Fotos e filtros da galeria, antes e depois                     |
| `src/data/images.ts`      | Catálogo de fotos (tamanhos, srcset das fotos HD, selo `ilustrativa`)           |
| `src/data/fotosServicos.ts` | Foto de cada card em /servicos                                                |

Os campos que dependem do cliente estão marcados com `TODO(cliente)` no código.

## Antes de publicar (checklist)

**Bloqueia o lançamento**

- [ ] Endpoint do formulário (`VITE_CONTACT_ENDPOINT`), senão as mensagens se perdem
- [ ] Número real do WhatsApp e telefone (`site.ts`)
- [ ] Endereço completo e `address.confirmed: true` (`site.ts`). Enquanto for `false`, o mapa, a página de contato e o JSON-LD mostram só a cidade
- [ ] Equipe real: nomes, funções, bios, fotos e Instagram (`mockData.ts`), depois `MOCK_DATA = false`. Com `true`, a página Equipe mostra o aviso "Perfis ilustrativos" e os ícones do Instagram levam ao perfil do salão
- [ ] Domínio definitivo em `site.url`

**Conteúdo**

- [ ] Fotos originais em alta resolução (as atuais vêm do Instagram, máx. 640px)
- [ ] **Trocar as fotos `hd-` (banco de imagens, ilustrativas)** por fotos reais do salão: hero da Home, topo e cards de Serviços, 6 fotos da Galeria e a faixa da Equipe. Veja "Fotos HD" abaixo
- [ ] Logo oficial em vetor: o monograma "MS" (`Monograma.tsx`) é uma aproximação feita em código
- [ ] Pares reais de **antes e depois** (`transformacoes.ts`, hoje `ilustrativo: true`)
- [ ] Depoimentos reais com autorização (`depoimentos.ts`, hoje `ilustrativo: true`)
- [ ] Lista de serviços, durações e valores (`servicos.ts`; preço `null` = "Valor sob consulta")
- [ ] Respostas do FAQ conforme a política do salão (`faq.ts`)
- [ ] Texto de "Nossa história" na página Equipe (`pages/Equipe.tsx`), validar com a May
- [ ] Horário de funcionamento (`site.hours`, hoje seg a sáb, 9h às 19h). O selo "Aberto agora" usa esse horário
- [ ] Imagem de compartilhamento (`public/og-image.jpg`, 1200×630): trocar por uma foto de alta resolução quando houver
- [ ] Ano de abertura do salão: o número "8+ anos transformando Inhumas" aparece na Home (`stats.ts`)
- [ ] Nota no Google, se houver (`stats.ts`)

## Estrutura

```
src/
  components/
    Header.tsx            header fixo, transparente sobre heroes escuros, blur ao rolar
    MobileDrawer.tsx      menu lateral (mobile/tablet), acessível
    MobileBottomNav.tsx   barra inferior (só < 768px)
    Footer.tsx
    WhatsAppButton.tsx    botão flutuante com anel pulsante e tooltip
    Layout.tsx            estrutura global (skip link, header, main, footer)
    PageTransition.tsx    entrada: fade + sobe 20px · saída: fade + sobe 10px (0.4s)
    IntroAnimation.tsx    abertura "MS" + cortina, uma vez por sessão
    Logo.tsx              monograma + "May Salon" (mode full | icon), no Header e no Footer
    Monograma.tsx         o "MS" em SVG (aproximação até chegar o vetor oficial)
    ScrollProgress.tsx    fio gold de progresso da página, logo abaixo do header
    CustomCursor.tsx      ponto gold que segue o mouse (só desktop com mouse)
    ScrollReveal.tsx      bloco que aparece ao entrar na tela (fadeUp, clip, scale)
    TextRevealWords.tsx   título palavra por palavra
    ParallaxSection.tsx   seção com fundo em outra velocidade (mola)
    HorizontalMarquee.tsx faixa de texto infinita (decorativa)
    PageHeader.tsx        breadcrumb + título das páginas internas (text reveal nos heroes escuros)
    Seo.tsx               title, description, canonical, Open Graph, Twitter e JSON-LD
    RevealTitle.tsx       text reveal linha a linha (só em heroes)
    Stagger.tsx           container + item de stagger reveal
    Reveal.tsx            bloco que aparece ao entrar na tela
    ParallaxImage.tsx     foto com parallax sutil dentro da moldura
    Magnetic.tsx          cursor magnético nos CTAs gold (só com mouse)
    AnimatedCounter.tsx   contador 0 → valor (MotionValue, 1.8s)
    ServiceCard.tsx       card de serviço (variantes bento e lista, hover em mola)
    TeamCard.tsx          card da equipe que vira (CSS 3D, aria-expanded, face escondida inert)
    BeforeAfterSlider.tsx comparador antes/depois (arraste e teclado)
    TestimonialsCarousel.tsx
    Lightbox.tsx          foto em tela cheia (Esc, setas, swipe, foco preso)
    FilterPills.tsx       pills de filtro (aria-pressed, rola no mobile)
    WizardProgress.tsx    progresso do agendamento em 3 etapas
    Accordion.tsx         FAQ acessível
    MirrorFrame.tsx       "espelho cápsula", assinatura visual
    Picture.tsx           <picture> WebP + JPG com dimensões reais, lazy por padrão
    contato/              formulário e selo "Aberto agora"
    home/                 seções da Home
    icons/BrandIcons.tsx  WhatsApp e Instagram (o Lucide v1 não tem ícones de marca)
  pages/                  uma página por rota (carregadas sob demanda)
  data/                   serviços, equipe, galeria, depoimentos, transformações, FAQ, números, imagens
  config/
    site.ts               dados do negócio
    seo.ts                títulos e descrições
    schema.ts             JSON-LD BeautySalon (página Contato)
    routes.ts             rotas com hero escuro
  lib/
    motion.ts             linguagem de movimento (curvas, stagger, text reveal, clip, scale, linhas, mola)
    intro.ts              regra de "uma vez por sessão" da abertura e o contexto que segura os heroes
    grade.ts              colunas de grade sem card órfão
    smoothScroll.ts       Lenis ligado ao loop do Framer Motion
    horario.ts            aberto/fechado no fuso do salão (sem biblioteca)
    contato.ts            envio do formulário
    mapa.ts               links do Google Maps
    whatsapp.ts           links e mensagens do WhatsApp
  hooks/                  useScrolled, useBodyScrollLock, useMagneticEffect, useFilterParam, useColumnCount
  styles/globals.css      tokens de cor, botões, campos, card 3D, foco, reduced-motion
vite.config.ts            inclui o plugin que gera as tags fixas de SEO, o robots.txt e o sitemap.xml
tailwind.config.ts        tema completo (cores, fontes, tipografia fluida, sombras, z-index)
```

## Fotos HD

As fotos com prefixo `hd-` saíram da pasta `MaySalon/fotos_hd` (Unsplash). São **ilustrativas**: não mostram o salão nem o trabalho da equipe, e o site avisa isso onde poderiam ser lidas assim (legenda "Imagens ilustrativas" no hero, selo "Ilustrativa" na Galeria, "Imagem ilustrativa" no topo de Serviços e na faixa da Equipe, nota nos cards de Serviços). A foto real do salão continua em "Nossa história".

Cada foto foi escolhida pelo **conteúdo**, não pelo nome do arquivo (vários nomes não batem com a imagem):

| No site | Arquivo de origem | O que a foto mostra | Onde aparece |
| --- | --- | --- | --- |
| `hd-hero-ondas`, `hd-ondas` | `galeria_01_morena_iluminada.jpg` | cabelo com mechas caramelo, de costas | hero, Galeria, card Colorimetria |
| `hd-hero-cachos` | `hero_01_cabelo_escuro.jpg` | cabelo crespo volumoso | hero |
| `hd-hero-loira` | `hero_03_editorial_escuro.jpg` | loira sorrindo, ao ar livre | hero, Galeria |
| `hd-servicos-cor` | `ambiente_02_espelho.jpg` | cabelo rosa em movimento (não é espelho) | topo de Serviços |
| `hd-escova` | `galeria_02_loira_ondulada.jpg` | escova com secador | card Corte, Galeria |
| `hd-escova-curto` | `colorimetria_02_processo.jpg` | modelagem com prancha | card Penteados, Galeria |
| `hd-sobrancelha`, `hd-sobrancelha-close` | `maquiagem_01_make_nude.jpg` | design de sobrancelha | cards Sobrancelha e Despigmentação, Galeria |
| `hd-make`, `hd-olhar` | `maquiagem_03_aplicacao.jpg` | maquiagem (e o olho, recortado) | cards Maquiagem e Cílios, Galeria |
| `hd-noiva` | `noiva_03_coque.jpg` | noiva com buquê | card Dia da Noiva |
| `hd-lavatorio` | `corte_02_finalizacao.jpg` | lavatório | card Tratamentos |
| `hd-salao` | `corte_01_tesoura.jpg` | interior de salão com espelhos redondos | faixa da Equipe |

Ficaram de fora por não combinarem com o salão ou com o nome: `olhar_02_sobrancelha` (uma camisa), `maquiagem_02_make_noite` (manicure), `colorimetria_03_loiro_platinado` (barbearia), `noiva_02_preparacao` (vestido vermelho), `tratamento_01_hidratacao` (produtos com logo de marca), `olhar_01_cilios` (paleta de sombras), `noiva_01_penteado` (buquê em fundo escuro), `colorimetria_01_balayage` (salão em preto e branco) e `ambiente_01_interior` (outro salão, de cadeiras rosa, que poderia ser confundido com o May).

Cada foto HD tem duas larguras (480 e 960px; a faixa do salão, 768/1280/1920) em WebP + JPG, e o navegador escolhe pela tela (`srcset` + `sizes`). Para trocar por uma foto real: gere os arquivos com o mesmo nome (`public/images/<nome>-<largura>.webp|jpg`), ajuste `w`/`h` em `images.ts` e tire o `ilustrativa: true`; os selos somem sozinhos.

## Design system

Paleta **Sage Orgânico · Blush Natural · Gold Envelhecido** (tokens em `src/styles/globals.css`, classes em `tailwind.config.ts`).

| Token (classe)             | Cor       | Uso                                                        |
| -------------------------- | --------- | ---------------------------------------------------------- |
| `primary` / `sage`         | `#687F6A` | Cor da marca: bordas, ícones, indicadores (não em texto pequeno) |
| `primary-600`              | `#526754` | Fundo do botão do WhatsApp (ícone branco 6.1:1)            |
| `primary-700`              | `#3E513F` | Texto sage em fundo claro (7.6:1)                          |
| `primary-300`              | `#94AE96` | Eyebrows e ícones sage sobre `bg-deep` (6.4:1)             |
| `gold`                     | `#C9A84C` | **Só CTAs** (texto `ink`, 7.8:1), números da faixa de prova social e fios decorativos (progresso, cursor, linhas) |
| `gold-dark`                | `#A08438` | Hover do CTA (texto `ink`, 5:1)                            |
| `blush` / `accent`         | `#D4A5A5` | Acento: depoimentos, selo "Sob consulta", borda de erro nos campos |
| `sand` / `cream`           | `#E8D5C4` | Seções e cartões neutros                                   |
| `ivory` / `champagne`      | `#FAF0EE` | Fundo principal                                            |
| `deep`                     | `#1E2720` | Hero, seções de impacto e rodapé                           |
| `ink` / `charcoal`         | `#1C1714` | Texto principal                                            |
| `charcoal-soft`            | `#483C34` | Texto de apoio (inclusive sobre `sand`, 7.5:1)             |
| `muted-strong`             | `#6E6058` | Texto secundário **só sobre ivory** (5.4:1)                |
| `muted`                    | `#988A80` | Só decorativo                                              |

### Armadilhas de contraste (recalculadas)

- `muted` sobre ivory = **3.0:1**: reprova para texto. Use `muted-strong`.
- `muted-strong` sobre sand = **4.2:1**: reprova para texto pequeno. Em seções sand, use `charcoal-soft`.
- `gold` sobre ivory = **2.0:1**: nunca usar gold como texto em fundo claro (links "gold" viram texto `primary-700` com sublinhado gold).
- `sage` sobre ivory = **3.9:1**: bom para bordas e ícones, não para texto pequeno.

Fontes (Google Fonts, `display=swap`, com `preconnect` e `preload`): **Playfair Display** (títulos), **DM Sans** (texto), **Cormorant Garamond itálico** (destaques).

**Assinatura visual:** o "espelho cápsula" (`MirrorFrame`), inspirado nos espelhos ovais de moldura dourada do próprio salão. Todas as fotos de pessoas (equipe, história, hero) usam esse recorte.

## Animações

Regras em `src/lib/motion.ts`, valendo para o site inteiro:

- **Scroll suave (Lenis)**, ligado ao mesmo loop de quadros do Framer Motion. Pausa com menu e lightbox abertos.
- **Abertura (intro)**, uma vez por sessão (`sessionStorage` `may_intro_seen`): o "MS" aparece, um fio gold desenha, "May Salon" surge e a tela se abre em duas metades (≈2.8s). Os heroes só animam quando a cortina abre. Para ver de novo: DevTools → Application → Session Storage → apague `may_intro_seen` (ou abra uma aba anônima).
- **Stagger reveal** em cards de equipe, depoimentos, números, FAQ e blocos de texto: `opacity 0, y 32 → 0` em 0.7s, 0.12s entre itens, uma vez, 80px antes de entrar na tela.
- **Clip reveal** (a foto "destampa", 1s): de baixo para cima no espelho do hero, topo de Serviços, fotos da Galeria e faixa da Equipe; da esquerda para a direita na foto de "Nossa história", nos antes e depois e nas informações de Contato. Ao terminar, o recorte sai (não corta foco nem sombra).
- **Scale reveal** (1.15 → 1, 1.2s): cards do bento da Home, cards de /servicos e opções da etapa 1 do agendamento.
- **Título palavra por palavra** (sobe 12px e sai do desfoque): hero da Home, Depoimentos, CTA final, FAQ e "Nossa história" da Equipe. Nos outros heroes, **text reveal linha a linha**.
- **Linhas que desenham**: divisórias dos números da Home, fio antes do Instagram, fio gold antes do FAQ e trilho do agendamento.
- **Faixas de texto infinitas** (25s por volta, pausa com o mouse): nomes dos serviços na Home e nomes da equipe.
- **Parallax** só em fundos e fotos (hero, faixa da Equipe, fotos em split). Nunca em texto.
- **Fotos do hero** trocam a cada 5.5s em crossfade.
- **Contador** dos números da Home: 1.8s, sai de um desfoque de 4px, cada número um pouco depois do anterior.
- **Barra de progresso** gold de 1px logo abaixo do header.
- **Cursor** (só desktop com mouse): ponto gold de 12px; anel de 40px sobre links e botões; "+" sobre as fotos da Galeria. O cursor do sistema continua visível.
- **Cursor magnético** (±8px, mola) nos CTAs gold, só com mouse (`pointer: fine`).
- **Hover em mola** (stiffness 300, damping 20): cards de serviço sobem 6px e giram 0.5°; cards da equipe sobem 8px e crescem 2%.
- **Filtros** (galeria e abas de serviços): quem sai some em 100ms; quem entra sobe 16px, 40ms um depois do outro.
- **Lightbox**: a foto entra assentando de 1.1 para 1.
- Selo "Aberto agora" com um halo suave a cada 2s.
- Tudo com `viewport once`: nada anima de novo ao voltar a rolar.

## Acessibilidade e movimento

- Link "Pular para o conteúdo" no primeiro Tab. Ao trocar de rota, o foco vai para o `<main>`.
- Menu mobile e lightbox com `role="dialog"`, foco preso, Esc fecha e o foco volta para quem abriu.
- Card da equipe: botão com `aria-expanded`; a face escondida fica `inert` (fora do Tab e dos leitores de tela).
- Formulário: todo campo com `<label for>`, erro escrito e ligado ao campo (`aria-invalid` + `aria-describedby`), foco vai para o primeiro campo com erro.
- Mapa com `title` descritivo e link alternativo "Abrir no Google Maps".
- Todos os alvos de toque têm no mínimo 44×44px. Nada rola para o lado em 320px.
- **`prefers-reduced-motion`:** a abertura não aparece; o Lenis nem é criado (scroll nativo); o `<MotionConfig reducedMotion="user">` tira os deslocamentos; clip, scale, desfoque e palavra por palavra viram só fade; parallax, troca de fotos do hero, cursor, barra de progresso, cursor magnético e hover em mola são desligados no código; as faixas de texto ficam paradas; o card da equipe troca de face sem girar; o CSS desliga o anel pulsante e as transições longas.

## SEO

- Título e descrição por página em `src/config/seo.ts`; `<Seo>` gera canonical, Open Graph (`og:type`, `og:title`, `og:description`, `og:url`, `og:image` 1200×630 e `og:image:alt`) e Twitter.
- `/contato` publica o JSON-LD `BeautySalon` (endereço, horários, telefone, Instagram).
- **Prévia por página no WhatsApp:** WhatsApp, Instagram e Facebook não executam JavaScript, só leem o HTML. Por isso o build grava um HTML por rota (`dist/index.html`, `dist/servicos/index.html`, `dist/galeria/index.html`, `dist/equipe/index.html`, `dist/agendamento/index.html`, `dist/contato/index.html`), cada um com title, description, canonical, Open Graph e Twitter da própria página (e o JSON-LD em `/contato`). As tags saem de `config/seo.ts`, a mesma fonte do `<Seo>`. No navegador, o React Helmet assume essas tags sem duplicar.
- Página nova no site: acrescente em `paginasPublicas` (`config/seo.ts`) e em `vercel.json`.
- O build também gera `sitemap.xml` e `robots.txt` (plugin em `vite.config.ts`).
- **Por que não `vite-plugin-prerender`:** foi testado. Ele depende do puppeteer 1.x, que baixa um Chrome 78, antigo demais para rodar o código do site (`?.` e `??` só chegaram no Chrome 80). Mesmo com um Chrome atual, 3 das 5 páginas internas saíram com as tags da Home (a captura acontece antes da rota carregar), e o pacote não carrega como ESM no Vite 6. Um navegador no build também costuma falhar na Vercel. Como o que o WhatsApp lê é só o `<head>`, gerar esses HTMLs direto da configuração resolve sem esses riscos.

## Status das fases

- [x] **Fase 1** · Layout global: Header, Footer, WhatsApp, barra inferior, rotas e transições
- [x] **Fase 2** · Paleta Sage/Gold/Blush + Home completa + Serviços (abas, cards, FAQ)
- [x] **Fase 3** · Galeria (masonry, lightbox, antes e depois) + Agendamento (assistente em 3 etapas via WhatsApp)
- [x] **Fase 4** · Animações (Lenis, stagger, text reveal, parallax, cursor magnético) + Equipe + Contato + SEO final + polimento
- [x] **Fase 5** · Abertura, logo em SVG, correções da auditoria, animações de scroll no site inteiro e fotos HD ilustrativas
