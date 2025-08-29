const express = require('express');
const path = require('path');
const app = express();
const rootDir = path.join(__dirname, 'public');
app.use(express.static(rootDir));

// Force download route for assets under /public
app.get('/dl/*', (req, res) => {
  const rel = req.params[0] || '';
  const safePath = path.normalize(path.join(rootDir, rel));
  // Prevent path traversal outside of public
  if (!safePath.startsWith(rootDir)) {
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
