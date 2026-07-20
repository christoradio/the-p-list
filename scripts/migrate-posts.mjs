// One-off migration: extract the POSTS array from the old single-file index.html
// and write each entry out as a content-collection markdown file.
// Run with: node scripts/migrate-posts.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import yaml from "js-yaml";

const OLD_HTML = "/Users/davidmegginson/Desktop/The P List/index.html";
const OUT_DIR = path.resolve("src/content/posts");

const html = fs.readFileSync(OLD_HTML, "utf8");

const start = html.indexOf("const POSTS = [");
if (start === -1) throw new Error("Could not find POSTS array");
const arrayStart = html.indexOf("[", start);

// Find the matching closing bracket for the array by bracket counting,
// respecting strings so brackets inside string literals don't confuse it.
function findMatchingBracket(str, openIdx) {
  let depth = 0;
  let inString = false;
  let quote = "";
  for (let i = openIdx; i < str.length; i++) {
    const c = str[i];
    const prev = str[i - 1];
    if (inString) {
      if (c === quote && prev !== "\\") inString = false;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inString = true;
      quote = c;
      continue;
    }
    if (c === "[") depth++;
    if (c === "]") {
      depth--;
      if (depth === 0) return i;
    }
  }
  throw new Error("No matching bracket found");
}

const arrayEnd = findMatchingBracket(html, arrayStart);
const arraySource = html.slice(arrayStart, arrayEnd + 1);

const sandbox = {};
vm.createContext(sandbox);
const POSTS = vm.runInContext(`(${arraySource})`, sandbox);

console.log(`Parsed ${POSTS.length} posts from old site.`);

fs.mkdirSync(OUT_DIR, { recursive: true });

POSTS.forEach((post, index) => {
  const { body, ...frontmatterFields } = post;
  // `order` preserves the exact original array position, which encoded the
  // site's "newest first, sold backdated to the bottom" display order —
  // content collections don't guarantee file/array order, so this makes it explicit.
  const frontmatter = { ...frontmatterFields, order: index };
  const yamlStr = yaml.dump(frontmatter, { lineWidth: -1, noRefs: true });
  const bodyMd = (body || []).join("\n\n");
  const fileContents = `---\n${yamlStr}---\n\n${bodyMd}\n`;
  const outPath = path.join(OUT_DIR, `${post.slug}.md`);
  fs.writeFileSync(outPath, fileContents, "utf8");
});

console.log(`Wrote ${POSTS.length} markdown files to ${OUT_DIR}`);
