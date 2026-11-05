import { existsSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineMdastPlugin } from 'satteri'
import { findImage, isLocalRaster, pictureHtml } from './r2-images.js'

// Swaps local images in blog posts for <picture> elements served from R2, using the
// manifest written by `npm run images`. An image that hasn't been uploaded yet is left
// alone so Astro optimizes it from disk, which keeps writing/previewing quick; if the
// file isn't on disk either (e.g. in CI), the build fails with a pointer to the fix,
// unless the post is still a draft.
export const r2Images = defineMdastPlugin({
  name: 'r2-images',
  image(node, ctx) {
    if (!ctx.fileURL || !isLocalRaster(node.url)) return
    const postDir = dirname(fileURLToPath(ctx.fileURL))
    if (!postDir.includes('/content/blog/')) return
    const slug = basename(postDir)

    const entry = findImage(slug, node.url)
    if (!entry) {
      if (existsSync(resolve(postDir, node.url))) return
      // drafts are rendered by every build (even though they're never published), so a
      // draft whose photos only exist on the writer's machine mustn't break CI
      if (ctx.data.astro?.frontmatter?.draft) {
        ctx.replaceNode(node, { type: 'html', value: `<p>[画像未アップロード: ${node.url}]</p>` })
        return
      }
      throw new Error(`${slug}: ${node.url} is neither uploaded nor on disk. Run \`npm run images\` on the machine that has the file.`)
    }
    ctx.replaceNode(node, { type: 'html', value: pictureHtml(entry, { alt: node.alt, title: node.title }) })
  },
})
