import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { site } from './src/config/site'
import { paginasPublicas } from './src/config/seo'
import { beautySalonJsonLd } from './src/config/schema'

type Pagina = (typeof paginasPublicas)[number]

const escapar = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Tags de SEO de uma página, iguais às que o <Seo> monta no navegador (mesma fonte: config/seo.ts) */
function tagsDaPagina(pagina: Pagina): string {
  const abs = (path: string) => new URL(path, site.url).toString()
  const img = site.ogImage
  const meta = (attr: 'name' | 'property', chave: string, valor: string) =>
    `<meta ${attr}="${chave}" content="${escapar(valor)}" data-rh="true">`
  const tags = [
    meta('name', 'description', pagina.description),
    `<link rel="canonical" href="${abs(pagina.path)}" data-rh="true">`,
    meta('property', 'og:type', 'website'),
    meta('property', 'og:locale', 'pt_BR'),
    meta('property', 'og:site_name', site.name),
    meta('property', 'og:title', pagina.title),
    meta('property', 'og:description', pagina.description),
    meta('property', 'og:url', abs(pagina.path)),
    meta('property', 'og:image', abs(img.path)),
    meta('property', 'og:image:width', String(img.width)),
    meta('property', 'og:image:height', String(img.height)),
    meta('property', 'og:image:alt', img.alt),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', pagina.title),
    meta('name', 'twitter:description', pagina.description),
    meta('name', 'twitter:image', abs(img.path)),
    meta('name', 'twitter:image:alt', img.alt),
  ]
  if (pagina.path === '/contato') {
    // JSON-LD sem "<" cru, para não fechar a tag <script> por acidente
    const json = JSON.stringify(beautySalonJsonLd()).replace(/</g, '\\u003c')
    tags.push(`<script type="application/ld+json" data-rh="true">${json}</script>`)
  }
  return `<!-- seo:inicio -->\n    ${tags.join('\n    ')}\n    <!-- seo:fim -->`
}

/** Troca o <title> e o bloco de SEO de um HTML já montado pelo Vite */
function comSeoDa(html: string, pagina: Pagina): string {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapar(pagina.title)}</title>`)
    .replace(/<!-- seo:inicio -->[\s\S]*?<!-- seo:fim -->/, tagsDaPagina(pagina))
}

/**
 * Prévia certa no WhatsApp para cada página, sem navegador no build.
 *
 * WhatsApp, Instagram e Facebook não executam JavaScript: leem só o HTML que o servidor entrega.
 * Por isso o build grava um HTML por rota (dist/servicos/index.html etc.), cada um com title,
 * description, canonical, Open Graph e Twitter da própria página. O corpo continua o mesmo do SPA:
 * o React monta a página normalmente e o React Helmet assume as tags (data-rh="true") sem duplicar.
 *
 * Também gera robots.txt e sitemap.xml com o domínio de site.url.
 */
function seoEstatico(): Plugin {
  const home = paginasPublicas[0]
  const hoje = new Date().toISOString().slice(0, 10)
  const abs = (path: string) => new URL(path, site.url).toString()

  return {
    name: 'may-salon-seo-estatico',
    transformIndexHtml(html) {
      return comSeoDa(html, home).replace('</head>', `  ${tagsDaPagina(home)}\n  </head>`)
    },
    generateBundle() {
      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...paginasPublicas.map(
          (p) =>
            `  <url><loc>${abs(p.path)}</loc><lastmod>${hoje}</lastmod><priority>${p.path === '/' ? '1.0' : '0.8'}</priority></url>`,
        ),
        '</urlset>',
        '',
      ].join('\n')
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n` })
    },
    writeBundle(options) {
      const outDir = options.dir ?? resolve('dist')
      const base = readFileSync(join(outDir, 'index.html'), 'utf8')
      for (const pagina of paginasPublicas.slice(1)) {
        const destino = join(outDir, pagina.path.slice(1), 'index.html')
        mkdirSync(dirname(destino), { recursive: true })
        writeFileSync(destino, comSeoDa(base, pagina))
      }
      // 404 para hospedagens estáticas sem rewrite (GitHub Pages): serve o app e deixa
      // o React Router mostrar a página "não encontrado". Na Vercel isso é redundante
      // (o vercel.json já manda tudo pro index.html), mas não atrapalha.
      writeFileSync(join(outDir, '404.html'), base)
    },
  }
}

// process.env.GITHUB_PAGES é setado só no workflow do GitHub Pages (.github/workflows/deploy.yml).
// Na Vercel (e localmente) o site continua servido da raiz.
const basePages = '/LandingPageMaySalon/'

export default defineConfig({
  base: process.env.GITHUB_PAGES ? basePages : '/',
  plugins: [react(), seoEstatico()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // Separa as libs grandes para melhor cache entre deploys
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
