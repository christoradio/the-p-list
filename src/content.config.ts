import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    suburb: z.string(),
    state: z.string().optional(),
    country: z.string().optional(),
    tags: z.array(z.string()),
    era: z.string(),
    beds: z.union([z.number(), z.string()]),
    baths: z.union([z.number(), z.string()]),
    cars: z.union([z.number(), z.string()]),
    quirk: z.number(),
    funStat: z.string().optional(),
    status: z.string().optional(),
    price: z.string().optional(),
    verdict: z.string(),
    youtubeId: z.string().optional(),
    noVideo: z.boolean().optional(),
    videoImage: z.string().optional(),
    heroImage: z.string().optional(),
    listingUrl: z.string(),
    listingLabel: z.string().optional(),
    photos: z
      .array(
        z.object({
          src: z.string(),
          caption: z.string().optional(),
        })
      )
      .default([]),
    date: z.coerce.date(),
    // Preserves the exact display order from the original single-file site
    // (newest at top, sold listings manually backdated toward the bottom) —
    // this was array order in the old POSTS array, not a date sort.
    order: z.number(),
  }),
});

export const collections = { posts };
