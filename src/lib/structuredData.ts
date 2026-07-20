import type { Post } from "./utils";
import { SITE_URL, postSeoDescription, absoluteImage, cardMediaSrc } from "./utils";

// Escapes "<" so a raw JSON blob can't be broken out of its <script> tag
// (e.g. by a verdict/caption that happens to contain "</script>").
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "The P List",
        url: SITE_URL,
        sameAs: [
          "https://www.instagram.com/christoradio",
          "https://www.youtube.com/@christoradio",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "The P List",
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

export function postJsonLd(post: Post) {
  const url = `${SITE_URL}/post/${post.data.slug}`;
  const images = [
    ...new Set(
      [post.data.heroImage, ...post.data.photos.map((p) => p.src)]
        .filter((src): src is string => Boolean(src))
        .map((src) => absoluteImage(src))
    ),
  ];
  const cover = cardMediaSrc(post);
  const dateISO = new Date(post.data.date).toISOString();

  const address: Record<string, string> = {
    "@type": "PostalAddress",
    addressLocality: post.data.suburb,
    addressCountry: post.data.country ? post.data.country : "AU",
  };
  if (!post.data.country && post.data.state) {
    address.addressRegion = post.data.state;
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        headline: post.data.title,
        description: postSeoDescription(post),
        image: images.length ? images : cover ? [absoluteImage(cover)] : undefined,
        datePublished: dateISO,
        dateModified: dateISO,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        url,
        about: {
          "@type": "Residence",
          name: post.data.title,
          address,
        },
        keywords: post.data.tags?.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: post.data.title, item: url },
        ],
      },
    ],
  };
}
