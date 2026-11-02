import { renderOgImage } from '../../lib/og-image.jsx'

export async function GET() {
  const png = await renderOgImage({ title: 'Tanakee', label: 'portfolio' })
  return new Response(png, { headers: { 'Content-Type': 'image/png' } })
}
