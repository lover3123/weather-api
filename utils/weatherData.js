const openWeatherMap = {
  BASE_URL: "https://api.openweathermap.org/data/2.5/weather?q=",
  SECRET_KEY: process.env.OPENWEATHER_API_KEY || "11e745f5ea9c0c1ee4d18a70557aceb0",
};

const weatherData = async (address, callback) => {
  const url =
    openWeatherMap.BASE_URL +
    encodeURIComponent(address) +
    "&APPID=" +
    openWeatherMap.SECRET_KEY +
    "&units=metric";

  try {
    const response = await fetch(url);
    const data = await response.json();

    // If the API returns an error (like city not found)
    if (!response.ok) {
      return callback("Unable to fetch data: " + (data.message || "Unknown error"), undefined);
    }

    // Success! Send the data back
    callback(undefined, data);
    
  } catch (error) {
    // This catches network errors (e.g., no internet connection)
    callback("Unable to connect to the weather service. " + error.message, undefined);
  }
};

module.exports = weatherData;
