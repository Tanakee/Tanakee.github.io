// shared by the site build and scripts/images.mjs (plain Node, so no JSON imports here)

// manifest keys are "<post slug>/<path as written in the post>", e.g. "hello/photos/pond.jpg"
export function imageKey(slug, src) {
  return `${slug}/${src.replace(/^\.\//, '')}`
}

export function isLocalRaster(src) {
  return !/^[a-z]+:|^\/\//i.test(src) && /\.(jpe?g|png|webp|avif|gif|heic)$/i.test(src)
}
