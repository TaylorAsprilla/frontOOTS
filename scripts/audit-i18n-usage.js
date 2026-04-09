/**
 * Audit i18n usage: finds all translation keys used in the app
 * and checks which ones are missing from the locale files.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src/app');
const I18N = path.join(ROOT, 'src/assets/i18n');

// --- Recursively collect all files ---
function walkFiles(dir, exts) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) results.push(...walkFiles(full, exts));
    else if (exts.some((x) => e.name.endsWith(x))) results.push(full);
  }
  return results;
}

// --- Extract keys from HTML: 'some.key' | transloco ---
function extractHtmlKeys(content) {
  const keys = [];
  for (const m of content.matchAll(/'([a-zA-Z0-9._-]+)'\s*\|\s*transloco/g)) keys.push(m[1]);
  // also: [translocoRead]="'some.scope'" not a key but also:
  // translocoRead scoped: handled separately
  return keys;
}

// --- Extract keys from TS: translate('some.key') or translocoService.translate('some.key') ---
function extractTsKeys(content) {
  const keys = [];
  for (const m of content.matchAll(/\btranslate\(\s*'([a-zA-Z0-9._-]+)'/g)) keys.push(m[1]);
  for (const m of content.matchAll(/\bgetTranslation\(\s*'([a-zA-Z0-9._-]+)'/g)) keys.push(m[1]);
  return keys;
}

// --- Flatten JSON object to dot-notation keys ---
function flatten(obj, prefix = '') {
  const keys = [];
  for (const k of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys.push(...flatten(obj[k], full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

// --- Main ---
const htmlFiles = walkFiles(SRC, ['.html']);
const tsFiles = walkFiles(SRC, ['.ts']);

const usedKeys = new Set();

for (const f of htmlFiles) {
  const content = fs.readFileSync(f, 'utf8');
  for (const k of extractHtmlKeys(content)) usedKeys.add(k);
}
for (const f of tsFiles) {
  const content = fs.readFileSync(f, 'utf8');
  for (const k of extractTsKeys(content)) usedKeys.add(k);
}

const sortedUsed = [...usedKeys].sort();

// Load all locale files
const locales = ['es-CO', 'es-PR', 'en'];
const localeSets = {};
for (const loc of locales) {
  const data = JSON.parse(fs.readFileSync(path.join(I18N, `${loc}.json`), 'utf8'));
  localeSets[loc] = new Set(flatten(data));
}

// Report missing keys per locale
let totalMissing = 0;
for (const loc of locales) {
  const missing = sortedUsed.filter((k) => !localeSets[loc].has(k));
  console.log(`\n=== Missing in ${loc}.json (${missing.length}) ===`);
  if (missing.length) missing.forEach((k) => console.log(`  ${k}`));
  totalMissing += missing.length;
}

console.log(`\nTotal keys used in app: ${sortedUsed.length}`);
console.log(`Total missing translations across all locales: ${totalMissing}`);
