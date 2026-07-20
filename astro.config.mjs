// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

// Read post frontmatter directly (outside Astro's content-collection runtime,
// which isn't available yet at config-load time) so the sitemap can carry
// real per-page lastmod dates instead of a single build-time stamp.
const postsDir = path.resolve('./src/content/posts');
const slugToDate = new Map();
const tagToLatestDate = new Map();
let newestDate = null;

for (const file of fs.readdirSync(postsDir)) {
  if (!file.endsWith('.md')) continue;
  const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) continue;
  const frontmatter = yaml.load(match[1]);
  const date = new Date(frontmatter.date);
  if (Number.isNaN(date.getTime())) continue;

  slugToDate.set(frontmatter.slug, date);
  if (!newestDate || date > newestDate) newestDate = date;

  for (const tag of frontmatter.tags ?? []) {
    const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');
    const existing = tagToLatestDate.get(tagSlug);
    if (!existing || date > existing) tagToLatestDate.set(tagSlug, date);
  }
}

const buildDate = new Date();

// https://astro.build/config
export default defineConfig({
  site: 'https://theplist.com.au',
  integrations: [
    sitemap({
      serialize(item) {
        const { pathname } = new URL(item.url);
        const postMatch = pathname.match(/^\/post\/([^/]+)\/?$/);
        if (postMatch && slugToDate.has(postMatch[1])) {
          item.lastmod = slugToDate.get(postMatch[1]).toISOString();
          return item;
        }
        const tagMatch = pathname.match(/^\/tag\/([^/]+)\/?$/);
        if (tagMatch && tagToLatestDate.has(tagMatch[1])) {
          item.lastmod = tagToLatestDate.get(tagMatch[1]).toISOString();
          return item;
        }
        item.lastmod = (pathname === '/' && newestDate ? newestDate : buildDate).toISOString();
        return item;
      },
    }),
  ],
});
