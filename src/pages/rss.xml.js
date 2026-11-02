import rss from '@astrojs/rss'
import { getPosts } from '../lib/posts.js'

export async function GET(context) {
  const posts = await getPosts()
  return rss({
    title: 'tanakee blog',
    description: 'tanakee のブログ。作ったものや試したことを書いています。',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    })),
  })
}
