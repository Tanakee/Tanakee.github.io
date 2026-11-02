// Uploads the photos used by blog posts to Cloudflare R2 and records them in
// src/data/images.json, which the site build reads instead of the (git-ignored) files.
//
//   npm run images            (re-encode only new or changed photos)
//   npm run images -- --force (re-encode everything and re-check R2)
//
// Each photo is auto-rotated, stripped of metadata (EXIF/GPS) and resized to a few
// widths in AVIF and WebP. Objects are named after the content hash, so unchanged
// photos are skipped and every URL can be cached forever.
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import sharp from 'sharp'
import { HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { imageKey, isLocalRaster } from '../src/lib/image-paths.js'

const BLOG_DIR = 'src/content/blog'
const MANIFEST = 'src/data/images.json'
const WIDTHS = [480, 960, 1600]
const QUALITY = { avif: 55, webp: 78 }
const CONTENT_TYPE = { avif: 'image/avif', webp: 'image/webp' }
const FORCE = process.argv.includes('--force')
const WARN_BYTES = 8 * 1024 ** 3 // the free tier stops at 10 GB

const env = (name) => {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is missing. Copy .env.example to .env and fill it in.`)
  return value
}

const bucket = env('R2_BUCKET')
const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${env('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: env('R2_ACCESS_KEY_ID'), secretAccessKey: env('R2_SECRET_ACCESS_KEY') },
})

// image paths a post refers to: markdown images in the body plus the frontmatter cover
function referencedImages(markdown) {
  const refs = new Set()
  const [, frontmatter = '', body = markdown] = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? []
  // examples inside code blocks and inline code aren't real images
  const prose = body.replace(/^(```|~~~)[\s\S]*?^\1/gm, '').replace(/`[^`\n]*`/g, '')
  for (const [, src] of prose.matchAll(/!\[[^\]]*\]\(\s*<?([^)\s>]+)/g)) refs.add(src)
  const cover = frontmatter.match(/^cover:\s*['"]?([^'"\s#]+)/m)?.[1]
  if (cover) refs.add(cover)
  return [...refs].filter(isLocalRaster)
}

async function exists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    return true
  } catch (error) {
    if (error.$metadata?.httpStatusCode === 404) return false
    throw error
  }
}

async function upload(key, body, format) {
  if (await exists(key)) return false
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: CONTENT_TYPE[format],
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  )
  return true
}

async function processImage(input, hash, file) {
  const animated = /\.gif$/i.test(file)
  const image = sharp(input, { animated }).autoOrient()
  const { width, height } = await image.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info)
  const { dominant } = await image.clone().stats()

  const largest = Math.min(width, WIDTHS.at(-1))
  const widths = [...new Set([...WIDTHS.filter((w) => w < largest), largest])]
  // sharp can't write animated AVIF, so GIFs become animated WebP only
  const formats = animated ? ['webp'] : ['avif', 'webp']

  let uploaded = 0
  for (const w of widths) {
    for (const format of formats) {
      // sharp drops all metadata unless asked to keep it, so EXIF/GPS never leaves this machine
      const body = await image.clone().resize({ width: w })[format]({ quality: QUALITY[format] }).toBuffer()
      if (await upload(`blog/${hash}-${w}.${format}`, body, format)) uploaded++
    }
  }

  const hex = (n) => n.toString(16).padStart(2, '0')
  return {
    entry: {
      hash,
      width: largest,
      height: Math.round((height / width) * largest),
      widths,
      formats,
      color: `#${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}`,
    },
    uploaded,
  }
}

async function bucketSize() {
  let bytes = 0
  let count = 0
  let token
  do {
    const page = await s3.send(new ListObjectsV2Command({ Bucket: bucket, ContinuationToken: token }))
    for (const object of page.Contents ?? []) {
      bytes += object.Size
      count++
    }
    token = page.NextContinuationToken
  } while (token)
  return { bytes, count }
}

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))
const images = {}
const missing = []

for (const slug of readdirSync(BLOG_DIR)) {
  const postFile = join(BLOG_DIR, slug, 'index.md')
  if (!existsSync(postFile)) continue

  for (const src of referencedImages(readFileSync(postFile, 'utf8'))) {
    const key = imageKey(slug, src)
    const file = resolve(BLOG_DIR, slug, src)
    if (!existsSync(file)) {
      // uploaded from another machine: keep the existing record
      if (manifest.images[key]) images[key] = manifest.images[key]
      else missing.push(key)
      continue
    }
    const input = readFileSync(file)
    const hash = createHash('sha256').update(input).digest('hex').slice(0, 16)
    if (!FORCE && manifest.images[key]?.hash === hash) {
      images[key] = manifest.images[key]
      continue
    }
    const { entry, uploaded } = await processImage(input, hash, file)
    images[key] = entry
    console.log(`${key}  ${entry.width}x${entry.height}  uploaded ${uploaded} files`)
  }
}

const removed = Object.keys(manifest.images).filter((key) => !images[key])
for (const key of removed) console.log(`${key}  no longer used (left in R2)`)

const sorted = Object.fromEntries(Object.entries(images).sort(([a], [b]) => a.localeCompare(b)))
const next = `${JSON.stringify({ publicUrl: env('R2_PUBLIC_URL'), images: sorted }, null, 2)}\n`
if (next !== readFileSync(MANIFEST, 'utf8')) {
  writeFileSync(MANIFEST, next)
  // Astro caches rendered posts until the post file itself changes, so drop the cache
  // or posts would keep pointing at the old (local or R2) image URLs
  for (const store of ['.astro/data-store.json', 'node_modules/.astro/data-store.json']) rmSync(store, { force: true })
  console.log('\nManifest updated. Restart `npm run dev` if it is running.')
}

const { bytes, count } = await bucketSize()
const gb = (bytes / 1024 ** 3).toFixed(2)
console.log(`\nR2: ${count} files, ${gb} GB of the 10 GB free tier`)
if (bytes > WARN_BYTES) console.warn(`Warning: over ${WARN_BYTES / 1024 ** 3} GB. Past 10 GB, R2 starts billing.`)

if (missing.length > 0) {
  console.error(`\nNot found on disk and never uploaded:\n${missing.map((key) => `  ${key}`).join('\n')}`)
  process.exit(1)
}
