const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Welcome! Use /weather/:city to request weather data. Example: /weather/london');
});

app.get('/weather/:city', (req, res) => {
  const city = req.params.city;
  res.send(`Weather data for ${city} would go here.`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});