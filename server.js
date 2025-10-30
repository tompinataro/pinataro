const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const rootDir = path.join(__dirname, 'public');
app.use(express.static(rootDir));

const redirectsPath = path.join(__dirname, 'redirects.json');
const normalizeSlug = (value = '') => {
  const lower = value.trim().toLowerCase();
  return lower.endsWith('.') ? lower.slice(0, -1) : lower;
};

let redirects = Object.create(null);
const loadRedirects = () => {
  try {
    const raw = fs.readFileSync(redirectsPath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      redirects = Object.create(null);
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value !== 'string') continue;
        redirects[normalizeSlug(key)] = value;
      }
      console.log(`[redirects] Loaded ${Object.keys(redirects).length} redirect(s).`);
    } else {
      redirects = Object.create(null);
      console.warn(`[redirects] ${redirectsPath} did not contain an object. No redirects loaded.`);
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      redirects = Object.create(null);
      console.warn(`[redirects] No redirect file found at ${redirectsPath}.`);
    } else {
      console.error(`[redirects] Failed to load ${redirectsPath}:`, err);
    }
  }
};

loadRedirects();

try {
  fs.watchFile(redirectsPath, { interval: 5000 }, () => {
    console.log('[redirects] Change detected, reloading redirects...');
    loadRedirects();
  });
} catch (err) {
  console.error('[redirects] Failed to watch redirect file:', err);
}

app.get('/r/:slug', (req, res, next) => {
  const slug = normalizeSlug(req.params.slug);
  const target = redirects[slug];
  if (!target) return next();
  if (/^https?:\/\//i.test(target)) {
    return res.redirect(302, target);
  }
  const destination = target.startsWith('/') ? target : `/${target}`;
  return res.redirect(302, destination);
});

// Force download route for assets under /public
app.get('/dl/*', (req, res) => {
  // More robust extraction of the relative path
  const rel = decodeURIComponent(req.path.replace(/^\/dl\//, ''));
  // Resolve against the public root
  const safePath = path.resolve(rootDir, rel);
  // Prevent path traversal outside of public (ensure trailing separator)
  const rootWithSep = rootDir.endsWith(path.sep) ? rootDir : rootDir + path.sep;
  if (!safePath.startsWith(rootWithSep)) {
    return res.status(400).send('Invalid path');
  }
  res.download(safePath, path.basename(safePath), (err) => {
    if (err) {
      if (!res.headersSent) res.status(404).send('File not found');
    }
  });
});
app.get('*', (_, res) => res.sendFile(path.join(rootDir, 'index.html')));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
