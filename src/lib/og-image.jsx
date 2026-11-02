import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

const FONT_FAMILY = 'M PLUS Rounded 1c'
const fontCache = new Map()

// Google Fonts returns a TTF subset holding only the glyphs in `text`, which keeps
// the Japanese font small enough to fetch once per image at build time
async function loadFont(text) {
  if (fontCache.has(text)) return fontCache.get(text)
  const query = new URLSearchParams({ family: `${FONT_FAMILY}:wght@800`, text })
  const css = await fetch(`https://fonts.googleapis.com/css2?${query}`).then((res) => res.text())
  const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1]
  if (!url) throw new Error(`OG font not found in Google Fonts response:\n${css}`)
  const font = await fetch(url).then((res) => res.arrayBuffer())
  fontCache.set(text, font)
  return font
}

function Frog() {
  return (
    <svg width="260" height="200" viewBox="0 0 260 200">
      <ellipse cx="130" cy="160" rx="120" ry="34" fill="#6fae6c" />
      <path d="M130 160 L250 150 L240 172 Z" fill="#faf9f4" />
      <ellipse cx="130" cy="120" rx="70" ry="50" fill="#4f9d5a" />
      <circle cx="95" cy="78" r="26" fill="#4f9d5a" />
      <circle cx="165" cy="78" r="26" fill="#4f9d5a" />
      <circle cx="95" cy="76" r="15" fill="#ffffff" />
      <circle cx="165" cy="76" r="15" fill="#ffffff" />
      <circle cx="98" cy="78" r="8" fill="#233229" />
      <circle cx="168" cy="78" r="8" fill="#233229" />
      <path d="M108 128 Q130 142 152 128" stroke="#2f6b3a" stroke-width="5" fill="none" stroke-linecap="round" />
    </svg>
  )
}

export async function renderOgImage({ title, label = 'tanakee blog', footer = 'tanakee.com' }) {
  const font = await loadFont(`${title}${label}${footer}`)

  const svg = await satori(
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        position: 'relative',
        background: '#e8f1e4',
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 48,
          right: 48,
          bottom: 48,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px',
          borderRadius: 48,
          background: '#faf9f4',
          border: '2px solid #e7e3d8',
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, color: '#6b7a70' }}>{label}</div>
        <div
          style={{
            display: 'flex',
            maxWidth: 820,
            fontSize: title.length > 30 ? 52 : 64,
            lineHeight: 1.35,
            color: '#233229',
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 28, color: '#2f6b3a' }}>{footer}</div>
        <div style={{ position: 'absolute', right: 40, bottom: 24, display: 'flex' }}>
          <Frog />
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [{ name: FONT_FAMILY, data: font, weight: 800, style: 'normal' }],
    },
  )

  return new Resvg(svg).render().asPng()
}
