import manifest from '../data/images.json'
import { imageKey } from './image-paths.js'

export { imageKey, isLocalRaster } from './image-paths.js'

// the article column is 672px wide
export const ARTICLE_SIZES = '(min-width: 720px) 672px, 100vw'

const MIME = { avif: 'image/avif', webp: 'image/webp' }

export function findImage(slug, src) {
  return manifest.images[imageKey(slug, src)] ?? null
}

function url(entry, width, format) {
  return `${manifest.publicUrl}/blog/${entry.hash}-${width}.${format}`
}

function escape(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

export function pictureHtml(entry, { alt = '', title, className = '', sizes = ARTICLE_SIZES, eager = false } = {}) {
  const srcset = (format) => entry.widths.map((w) => `${url(entry, w, format)} ${w}w`).join(', ')
  const fallback = entry.formats.at(-1)
  const largest = entry.widths.at(-1)
  const sources = entry.formats
    .slice(0, -1)
    .map((format) => `<source type="${MIME[format]}" srcset="${srcset(format)}" sizes="${sizes}">`)
    .join('')
  const attrs = [
    `src="${url(entry, largest, fallback)}"`,
    `srcset="${srcset(fallback)}"`,
    `sizes="${sizes}"`,
    `width="${entry.width}"`,
    `height="${entry.height}"`,
    `alt="${escape(alt)}"`,
    title ? `title="${escape(title)}"` : '',
    eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"',
    'decoding="async"',
    className ? `class="${className}"` : '',
    // the dominant colour fills the box while the image loads
    `style="background-color:${entry.color}"`,
  ]
  return `<picture>${sources}<img ${attrs.filter(Boolean).join(' ')}></picture>`
}
