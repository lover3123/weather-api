const activityExtras = {
  low: 0,
  moderate: 0.35,
  high: 0.7,
};

const toNumber = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
};

const getOutdoorExtra = (hours) => {
  if (hours >= 3) return 1.2;
  if (hours >= 2) return 0.9;
  if (hours >= 1) return 0.5;
  if (hours >= 0.5) return 0.25;
  return 0;
};

const getHydrationAdvice = (weather, preferences = {}) => {
  const weightKg = toNumber(preferences.weightKg, 70);
  const outdoorHours = toNumber(preferences.outdoorHours, 0);
  const activity = preferences.activity || "low";

  const temperature = toNumber(weather.temperature, 24);
  const feelsLike = toNumber(weather.feelsLike, temperature);
  const humidity = toNumber(weather.humidity, 50);

  const baseLiters = weightKg * 0.035;
  let weatherExtra = 0;
  const factors = [];

  if (temperature >= 35 || feelsLike >= 38) {
    weatherExtra += 1;
    factors.push("Extreme heat increases sweat loss.");
  } else if (temperature >= 30 || feelsLike >= 33) {
    weatherExtra += 0.7;
    factors.push("Hot weather calls for extra fluids.");
  } else if (temperature >= 25) {
    weatherExtra += 0.35;
    factors.push("Warm weather slightly increases water needs.");
  }

  if (humidity >= 70 && temperature >= 24) {
    weatherExtra += 0.25;
    factors.push("High humidity makes cooling down harder.");
  }

  const activityExtra = activityExtras[activity] ?? activityExtras.low;
  if (activityExtra > 0) {
    factors.push(`${activity[0].toUpperCase() + activity.slice(1)} activity adds hydration demand.`);
  }

  const outdoorExtra = getOutdoorExtra(outdoorHours);
  if (outdoorExtra > 0) {
    factors.push("Outdoor time adds more fluid loss.");
  }

  const liters = Math.min(5, Math.max(1.8, baseLiters + weatherExtra + activityExtra + outdoorExtra));

  return {
    liters: Number(liters.toFixed(1)),
    baselineLiters: Number(baseLiters.toFixed(1)),
    extraLiters: Number((liters - baseLiters).toFixed(1)),
    message:
      factors.length > 0
        ? "Drink steadily through the day and add more if you sweat."
        : "Normal hydration should be enough for these conditions.",
    factors,
  };
};

module.exports = getHydrationAdvice;
