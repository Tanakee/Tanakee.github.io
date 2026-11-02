import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// one folder per post: src/content/blog/<slug>/index.md, with its images next to it
const blog = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/blog' }),
  schema:
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      // path next to index.md, served from R2 like the images in the body
      cover: z.string().optional(),
      draft: z.boolean().default(false),
    }),
})

export const collections = { blog }
