import type { CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

export const SITE_URL = "https://theplist.com.au";
export const DEFAULT_TITLE =
  "The P List — Quirky, Daggy & Downright Wild Real Estate Across Australia";
export const DEFAULT_DESC =
  "An affectionate, slightly cheeky tour of Australia's oddest, retro-est, most characterful homes for sale — quirky real estate, championed one Shorts video at a time.";
export const DEFAULT_IMAGE = `${SITE_URL}/images/og-share-card.png`;

export function truncateForSEO(str: string | undefined, max: number): string {
  if (!str) return "";
  if (str.length <= max) return str;
  return str.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

export function postSeoTitle(post: Post): string {
  const hookTag = post.data.tags?.[0] ?? "Quirky";
  return `${post.data.title} — ${hookTag} House in ${post.data.suburb}, ${post.data.state} | The P List`;
}

export function postSeoDescription(post: Post): string {
  return truncateForSEO(post.data.verdict || DEFAULT_DESC, 158);
}

export function absoluteImage(image: string | undefined): string {
  if (!image) return DEFAULT_IMAGE;
  return image.startsWith("http") ? image : `${SITE_URL}/${image.replace(/^\//, "")}`;
}

// Extracts the opening "Made the list for..." hook sentence from a full
// verdict paragraph, for use on cards/teasers where the full text is too much.
export function firstSentence(text: string | undefined): string {
  if (!text) return "";
  const match = text.match(/^.*?[a-zA-Z][.!?](?=\s+[A-Z]|\s*$)/);
  return match ? match[0] : text;
}

export function locationLabel(post: Post): string {
  const { suburb, state, country } = post.data;
  if (country) return `${suburb.toUpperCase()}, ${country.toUpperCase()}`;
  return `${suburb.toUpperCase()}, ${state}`;
}

export function statusBadgeClass(status: string | undefined): string {
  if (!status) return "for-sale";
  const raw = status.toLowerCase();
  if (raw === "sold") return "sold";
  if (raw.includes("not") || raw.includes("contract")) return "not-for-sale";
  return "for-sale";
}

export function cardMediaSrc(post: Post): string | undefined {
  return post.data.heroImage || post.data.photos?.[0]?.src;
}

// Sort order matches the original site: array position ("order") by default,
// which is how sold listings get manually pushed toward the bottom.
export function sortedByOrder(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => a.data.order - b.data.order);
}

export function relatedPosts(all: Post[], post: Post, count: number): Post[] {
  const pool = all.filter((p) => p.data.slug !== post.data.slug);
  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  const tagged = shuffled.filter((p) =>
    p.data.tags?.some((t) => post.data.tags?.includes(t))
  );
  const untagged = shuffled.filter((p) => !tagged.includes(p));
  return tagged.concat(untagged).slice(0, count);
}

export const GRID_CHUNK_HEADERS = [
  "Keep Scrolling, We Dare You",
  "Deeper Into The List",
  "Certified Unhinged Territory",
  "Still With Us? Good.",
  "The Plot Thickens",
  "You've Earned A Weirder One",
  "One More For The Road",
  "Nearly The Bottom (Allegedly)",
];

export const READ_MORE_LABELS = [
  "Read the full file",
  "See what we're dealing with",
  "Dive in, we dare you",
  "Get the full damage report",
  "Unpack this one",
];
