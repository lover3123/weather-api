Here is a comprehensive documentation of your project based on the code we reviewed and the fixes we implemented. This is structured like a professional `README.md` file, which you can save directly into your project folder!

***

# 🌤️ Node.js Weather Application

## 📌 Project Overview
This is a full-stack, server-rendered web application that provides real-time weather updates. Users can search for a specific city's weather or allow the browser's Geolocation API to automatically fetch the weather for their current location. 

The backend is powered by **Node.js** and **Express**, utilizing the **OpenWeatherMap API** to fetch weather data. The frontend is dynamically rendered using the **Handlebars (hbs)** templating engine.

---

## 🛠️ Tech Stack
* **Backend:** Node.js, Express.js
* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Templating Engine:** Handlebars (`hbs`)
* **External APIs:** OpenWeatherMap API (Weather Data), OpenStreetMap Nominatim API (Reverse Geocoding for Geolocation)


---

## 🚀 Key Features Implemented

1.  **Dynamic Rendering:** Implemented Handlebars to serve dynamic HTML pages (`index`, `404`) and reuse layout partials (`header`).
2.  **Browser Geolocation:** Integrated the native `navigator.geolocation` API on the client side. When granted permission, it finds the user's coordinates, converts them to a city name using OpenStreetMap, and fetches the local weather automatically.
3.  **City Search:** A fully functional search bar allowing users to query the weather of any global city.
4.  **Custom UI Widget:** Designed a responsive, gradient-styled weather card that updates icons dynamically based on weather conditions (using `weather-icons`).
5.  **Custom Backend API Endpoints:** Built a dedicated `/weather` endpoint in Express to keep the OpenWeatherMap API key secure on the server side and format the data before sending it to the client.

---

## 🐛 Bugs Squashed & Code Improvements

During the final phases of development, we addressed several critical issues to make the app secure, modern, and crash-resistant:

* **Environment & Dependency Fixes:** Resolved immediate Node server crashes by ensuring all core dependencies (`express`, `hbs`) were properly installed and port conflicts were cleared.
* **Security & Vulnerability Patching:** Removed the deprecated `request` package, completely eliminating 4 `npm` vulnerabilities (2 critical, 2 moderate).
* **Modernization to Native Fetch:** Refactored the `utils/weatherData.js` file to use Node 22's native, built-in `fetch` API, combined with `async/await` syntax for cleaner, more modern asynchronous code.
* **Eliminated the "Double-Callback" Bug:** Fixed a logical flow issue where an API error would trigger a callback but allow the function to continue running, which previously caused `ERR_HTTP_HEADERS_SENT` crashes in Express.
* **Standardized Error Handling:** Ensured that error messages from the OpenWeatherMap API are properly caught, formatted as JSON, and safely transmitted to the client UI without crashing the server.

---

## 💻 How to Run the Project

**1. Install Dependencies**
Ensure you are in the root directory of the project and run:
```bash
npm install
```

**2. Configure API Keys**
Ensure your OpenWeatherMap API key is active. *(Note: For future development, it is recommended to move the `SECRET_KEY` inside `utils/weatherData.js` to a `.env` file).*

**3. Start the Server**
Run the start script defined in your `package.json`:
```bash
npm run start
```

**4. View the App**
Open your web browser and navigate to:
`http://localhost:3000`
