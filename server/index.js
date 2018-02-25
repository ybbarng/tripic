const express = require('express');

const app = express();
const port = process.env.PORT || 3001;

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello from Express' });
});

app.get('/api/pics.json', (req, res) => {
  res.send([]);
});

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
