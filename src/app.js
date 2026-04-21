const express = require("express");
const hbs = require("hbs");
const path = require("path");

const app = express();
const weatherData = require("../utils/weatherData");
const formatWeatherData = require("../utils/weatherFormatter");

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, "../public");

const viewsPath = path.join(__dirname, "../templates/views");

const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicPath));

app.get("", (req, res) => {
  res.render("index", { title: "Weather App" });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.status(400).send({ error: "Address is required" });
  }

  weatherData(req.query.address, (error, result) => {
    if (error) {
      return res.status(400).send({ error: error });
    }

    res.send(
      formatWeatherData(result, {
        weightKg: req.query.weight,
        activity: req.query.activity,
        outdoorHours: req.query.outdoor,
      })
    );
  });
});

app.use((req, res) => {
  res.render("404", { title: "Page not found" });
});

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
