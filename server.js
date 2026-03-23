
const express = require('express');

const path = require('path');
const app = express();

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/NewPortfolio.html', (_req, res) => {
  res.redirect(301, '/');
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Serving on port ' + PORT));
