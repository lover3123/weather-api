const includesAny = (value, words) => {
  const text = String(value || "").toLowerCase();
  return words.some((word) => text.includes(word));
};

const getClothingAdvice = (weather) => {
  const temperature = Number(weather.temperature);
  const feelsLike = Number(weather.feelsLike);
  const windSpeed = Number(weather.windSpeed);
  const condition = `${weather.conditionMain || ""} ${weather.condition || ""}`;

  const items = [];
  let summary = "Comfortable everyday clothing";

  if (feelsLike >= 34 || temperature >= 32) {
    summary = "Light breathable clothing";
    items.push("Cotton or linen shirt", "Light trousers or shorts", "Cap or hat", "Sunglasses");
  } else if (temperature >= 24) {
    summary = "Light clothes with sun protection";
    items.push("Light shirt", "Comfortable breathable footwear", "Sunglasses");
  } else if (temperature >= 18) {
    summary = "Comfortable clothes with a light layer";
    items.push("T-shirt or shirt", "Light jacket or overshirt");
  } else if (temperature >= 10) {
    summary = "Warm layer recommended";
    items.push("Sweater or hoodie", "Light jacket", "Closed shoes");
  } else {
    summary = "Cold weather layers";
    items.push("Warm jacket", "Layered clothing", "Closed shoes", "Scarf or gloves if outside long");
  }

  if (includesAny(condition, ["rain", "drizzle", "thunderstorm"])) {
    items.push("Umbrella or rain jacket", "Water-resistant shoes");
  }

  if (includesAny(condition, ["snow"])) {
    items.push("Insulated footwear", "Gloves");
  }

  if (windSpeed >= 25) {
    items.push("Wind-resistant outer layer");
  }

  if (includesAny(condition, ["clear"]) && temperature >= 27) {
    items.push("Sunscreen");
  }

  return {
    summary,
    items: [...new Set(items)],
  };
};

module.exports = getClothingAdvice;
