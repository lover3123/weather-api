const getClothingAdvice = require("./clothingAdvice");
const getHydrationAdvice = require("./hydrationAdvice");

const round = (value, digits = 0) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Number(number.toFixed(digits));
};

const formatWeatherData = (data, preferences = {}) => {
  const temperature = round(data?.main?.temp);
  const feelsLike = round(data?.main?.feels_like);
  const windSpeed = round((data?.wind?.speed || 0) * 3.6, 1);
  const weather = data?.weather?.[0] || {};

  const formatted = {
    city: data?.name || "Unknown location",
    country: data?.sys?.country || "",
    temperature,
    feelsLike,
    humidity: data?.main?.humidity ?? null,
    windSpeed,
    condition: weather.description || "Weather unavailable",
    conditionMain: weather.main || "",
    icon: weather.icon || "",
  };

  formatted.hydration = getHydrationAdvice(formatted, preferences);
  formatted.clothing = getClothingAdvice(formatted);

  return formatted;
};

module.exports = formatWeatherData;
