/*
 * Stamps the build ref (short commit SHA) into index.html at deploy time.
 *
 * Netlify sets COMMIT_REF during a build, so each deploy gets a unique stamp
 * that shows in the app's bottom-right version badge. Locally there's no
 * COMMIT_REF, so the placeholder stays "dev".
 *
 * This must NEVER throw — a cosmetic version stamp should not be able to
 * fail a deploy. Any problem just logs a warning and leaves the file as-is.
 *
 * Usage: node scripts/version.js [path-to-html]   (defaults to index.html)
 */
const fs = require('fs');

const file = process.argv[2] || 'index.html';
const ref = (process.env.COMMIT_REF || '').slice(0, 7) || 'dev';

try {
  const before = fs.readFileSync(file, 'utf8');
  const after = before.replace(
    /(window\.__BUILD_REF__\s*=\s*")[^"]*(";)/,
    `$1${ref}$2`
  );
  if (after !== before) {
    fs.writeFileSync(file, after);
    console.log(`[version] stamped build ref "${ref}" into ${file}`);
  } else {
    console.warn(`[version] no __BUILD_REF__ placeholder found in ${file}; skipped`);
  }
} catch (err) {
  console.warn(`[version] skipped (${err.message})`);
}
