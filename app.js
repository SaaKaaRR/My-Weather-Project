const { response } = require("express");
const express = require("express");
const app = express();
const https = require("https");
const dotenv = require("dotenv").config();
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityQuery;

  const units = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    process.env.WEATHER_API_KEY +
    units;
  https.get(url, function (response) {
    console.log(response.statusCode);
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const weatherIcon = weatherData.weather[0].icon;
      const weatherCity = weatherData.name;
      const iconUrl =
        "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
      res.write(
        "<h1>The temperature in " +
          weatherCity +
          " is " +
          temp +
          " Degree Celcius</h1><p> The weather is " +
          weatherDescription +
          "<p>"
      );
      res.write("<img src=" + iconUrl + ">");

      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log("App running at port 3000");
});
