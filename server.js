const express = require('express');
const path = require('path');
const app = express();
const rootDir = path.join(__dirname, '.'); // change to 'public' if your index.html is there
app.use(express.static(rootDir));
app.get('*', (_, res) => res.sendFile(path.join(rootDir, 'index.html')));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));
