import { promises as fs } from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import strip from 'strip-comments';
import stripCss from 'strip-css-comments';

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
// repo root: two levels up from frontend/scripts
const repoRoot = path.resolve(scriptDir, '..', '..');

const globs = [
  '**/*.js',
  '**/*.jsx',
  '**/*.css',
  '**/*.html',
];

const ignore = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.git/**',
  '**/build/**',
  '**/.next/**',
  '**/.vercel/**',
  '**/.cache/**',
  '**/coverage/**',
];

function removeHtmlComments(content) {
  return content.replace(/<!--([\s\S]*?)-->/g, '');
}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  const content = await fs.readFile(file, 'utf8');
  let out = content;
  try {
    if (ext === '.css') {
      out = stripCss(content, { preserve: false });
    } else if (ext === '.html') {
      out = removeHtmlComments(content);
    } else if (ext === '.js' || ext === '.jsx') {
      out = strip(content);
    }
  } catch (e) {
    console.error('Failed to strip comments for', file, e.message);
    return;
  }
  if (out !== content) {
    await fs.writeFile(file, out, 'utf8');
    console.log('Stripped:', path.relative(repoRoot, file));
  }
}

async function main() {
  const entries = await fg(globs, { cwd: repoRoot, ignore, absolute: true, dot: true });
  for (const file of entries) {
    await processFile(file);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
