import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { satteri } from '@astrojs/markdown-satteri'
import { r2Images } from './src/lib/markdown-r2-images.js'

export default defineConfig({
  site: 'https://tanakee.com',
  trailingSlash: 'ignore',
  integrations: [react(), sitemap()],
  // article images get srcset/sizes and are never wider than the 672px text column (x2 for retina)
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  markdown: {
    processor: satteri({ mdastPlugins: [r2Images] }),
    shikiConfig: {
      theme: 'github-light',
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // resvg ships a native .node binary that the dependency optimizer can't bundle
    ssr: { external: ['@resvg/resvg-js'] },
    optimizeDeps: { exclude: ['@resvg/resvg-js'] },
  },
})
