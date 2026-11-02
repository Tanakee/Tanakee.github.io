import { renderOgImage } from '../../lib/og-image.jsx'
import { getPosts } from '../../lib/posts.js'

export async function getStaticPaths() {
  const posts = await getPosts()
  return posts.map((post) => ({ params: { slug: post.id }, props: { title: post.data.title } }))
}

export async function GET({ props }) {
  const png = await renderOgImage({ title: props.title })
  return new Response(png, { headers: { 'Content-Type': 'image/png' } })
}
