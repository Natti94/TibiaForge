// How to run (Windows PowerShell):
// 1) From the frontend folder:
//    npm run strip:comments
//
// 2) Or run directly with Node:
//    node ./scripts/removeComments.mjs
//
// This script removes comments from JS/JSX/CSS/HTML across the repo (excluding node_modules, dist, etc.).

import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fg from "fast-glob";
import strip from "strip-comments";
import stripCss from "strip-css-comments";

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const repoRoot = path.resolve(scriptDir, "..", "..");

const globs = ["**/*.js", "**/*.jsx", "**/*.css", "**/*.html"];

const ignore = [
  "**/node_modules/**",
  "**/dist/**",
  "**/.git/**",
  "**/build/**",
  "**/.next/**",
  "**/.vercel/**",
  "**/.cache/**",
  "**/coverage/**",
];

function removeHtmlComments(content) {
  return content.replace(/<!--([\s\S]*?)-->/g, "");
}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  const content = await fs.readFile(file, "utf8");
  let out = content;
  try {
    if (ext === ".css") {
      out = stripCss(content, { preserve: false });
    } else if (ext === ".html") {
      out = removeHtmlComments(content);
    } else if (ext === ".js" || ext === ".jsx") {
      out = strip(content);
    }
  } catch (e) {
    console.error("Failed to strip comments for", file, e.message);
    return;
  }
  if (out !== content) {
    await fs.writeFile(file, out, "utf8");
    console.log("Stripped:", path.relative(repoRoot, file));
  }
}

async function main() {
  const entries = await fg(globs, {
    cwd: repoRoot,
    ignore,
    absolute: true,
    onlyFiles: true,
    dot: true,
    followSymbolicLinks: false,
  });
  let changed = 0;
  let total = 0;
  const targetCss = path
    .join(
      repoRoot,
      "tibia-optimizer-frontend",
      "src",
      "components",
      "optimizer",
      "optimizer.css"
    )
    .toLowerCase();
  console.log("[strip] Root:", repoRoot);
  console.log("[strip] Files matched:", entries.length);
  for (const file of entries) {
    total += 1;
    if (file.toLowerCase() === targetCss) {
      console.log("[strip] Matched optimizer.css");
    }
    const before = await fs.readFile(file, "utf8");
    await processFile(file);
    const after = await fs.readFile(file, "utf8");
    if (after !== before) changed += 1;
  }
  console.log(`[strip] Done. Processed: ${total}, Changed: ${changed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
