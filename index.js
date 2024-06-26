const express = require('express');
const app = express();

const port = 8080;
const routes = require('./routes');


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});