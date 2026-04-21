const weatherApi = "/weather";

const weatherForm = document.querySelector(".weather-search");
const cityInput = document.querySelector(".city-input");
const weightInput = document.querySelector(".weight-input");
const activityInput = document.querySelector(".activity-input");
const outdoorInput = document.querySelector(".outdoor-input");
const locationButton = document.querySelector(".location-button");

const statusMessage = document.querySelector(".status-message");
const weatherIcon = document.querySelector(".weather-icon");
const weatherCondition = document.querySelector(".weather-condition");
const tempElement = document.querySelector(".temperature span");
const locationElement = document.querySelector(".place");
const dateElement = document.querySelector(".date");
const hydrationLiters = document.querySelector(".hydration-liters");
const hydrationMessage = document.querySelector(".hydration-message");
const hydrationFactors = document.querySelector(".hydration-factors");
const clothingSummary = document.querySelector(".clothing-summary");
const clothingItems = document.querySelector(".clothing-items");
const feelsLikeElement = document.querySelector(".feels-like");
const humidityElement = document.querySelector(".humidity");
const windSpeedElement = document.querySelector(".wind-speed");

let lastCity = cityInput.value;

function setDate() {
  const currentDate = new Date();
  dateElement.textContent = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function setStatus(message, type = "info") {
  statusMessage.textContent = message;
  statusMessage.dataset.type = type;
}

function renderList(element, items) {
  element.innerHTML = "";

  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    element.appendChild(listItem);
  });
}

function setLoading(city) {
  setStatus(`Loading weather for ${city}...`);
  locationElement.textContent = "Loading...";
  tempElement.textContent = "--";
  weatherCondition.textContent = "Checking current conditions";
  weatherIcon.removeAttribute("src");
  weatherIcon.alt = "";
  hydrationLiters.textContent = "-- L";
  hydrationMessage.textContent = "Calculating hydration estimate...";
  hydrationFactors.innerHTML = "";
  clothingSummary.textContent = "--";
  clothingItems.innerHTML = "";
  feelsLikeElement.innerHTML = "--&deg;C";
  humidityElement.textContent = "--%";
  windSpeedElement.textContent = "-- km/h";
}

async function getWeatherData(city) {
  const params = new URLSearchParams({
    address: city,
    weight: weightInput.value || "70",
    activity: activityInput.value,
    outdoor: outdoorInput.value,
  });

  const response = await fetch(`${weatherApi}?${params.toString()}`);
  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || "Unable to fetch weather data.");
  }

  return data;
}

function renderWeather(result) {
  const locationName = result.country ? `${result.city}, ${result.country}` : result.city;

  locationElement.textContent = locationName;
  tempElement.textContent = result.temperature ?? "--";
  weatherCondition.textContent = result.condition;
  feelsLikeElement.innerHTML = `${result.feelsLike ?? "--"}&deg;C`;
  humidityElement.textContent = `${result.humidity ?? "--"}%`;
  windSpeedElement.textContent = `${result.windSpeed ?? "--"} km/h`;

  if (result.icon) {
    weatherIcon.src = `https://openweathermap.org/img/wn/${result.icon}@4x.png`;
    weatherIcon.alt = result.condition;
  }

  hydrationLiters.textContent = `${result.hydration.liters} L`;
  hydrationMessage.textContent = result.hydration.message;
  renderList(hydrationFactors, result.hydration.factors);

  clothingSummary.textContent = result.clothing.summary;
  renderList(clothingItems, result.clothing.items);

  setStatus(`Updated weather for ${locationName}.`, "success");
}

async function showData(city) {
  const cleanCity = city.trim();

  if (!cleanCity) {
    setStatus("Enter a city name to check the weather.", "error");
    return;
  }

  lastCity = cleanCity;
  setLoading(cleanCity);

  try {
    const result = await getWeatherData(cleanCity);
    renderWeather(result);
  } catch (error) {
    setStatus(error.message, "error");
    locationElement.textContent = "City not found";
    weatherCondition.textContent = "Try another location";
  }
}

async function getCityFromLocation(latitude, longitude) {
  const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  const address = data.address || {};

  return address.city || address.town || address.village || address.state || "";
}

weatherForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showData(cityInput.value);
});

[weightInput, activityInput, outdoorInput].forEach((input) => {
  input.addEventListener("change", () => {
    if (lastCity) {
      showData(lastCity);
    }
  });
});

locationButton.addEventListener("click", () => {
  if (!("geolocation" in navigator)) {
    setStatus("Geolocation is not available in this browser.", "error");
    return;
  }

  setStatus("Finding your current location...");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const city = await getCityFromLocation(position.coords.latitude, position.coords.longitude);

        if (!city) {
          setStatus("Could not detect your city from this location.", "error");
          return;
        }

        cityInput.value = city;
        showData(city);
      } catch (error) {
        setStatus("Unable to detect city from your location.", "error");
      }
    },
    () => {
      setStatus("Location permission was not granted.", "error");
    }
  );
});

setDate();
showData(lastCity);
