import { getCollection } from 'astro:content'

// drafts show up in `astro dev` but never in a production build
export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft)
  return posts.sort((a, b) => b.data.date - a.data.date)
}

const dateFormat = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Asia/Tokyo',
})

export function formatDate(date) {
  return dateFormat.format(date)
}
