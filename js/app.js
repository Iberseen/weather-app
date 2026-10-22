const form = document.getElementById("search");
const cityInput = document.getElementById("city");
const statusEl = document.getElementById("status");
const currentEl = document.getElementById("current");
const forecastEl = document.getElementById("forecast");

const $ = (id) => document.getElementById(id);
const round = (n) => Math.round(n);

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("is-error", isError);
}

function renderCurrent(place, data) {
  const { current, current_units: units } = data;
  const [icon, desc] = Api.describe(current.weather_code);

  $("place").textContent = place;
  $("icon").textContent = icon;
  $("temp").textContent = `${round(current.temperature_2m)}°`;
  $("desc").textContent = desc;
  $("feels").textContent = `${round(current.apparent_temperature)}°`;
  $("wind").textContent = `${round(current.wind_speed_10m)} ${units.wind_speed_10m}`;
  $("humidity").textContent = `${current.relative_humidity_2m}%`;
  currentEl.hidden = false;
}

function renderForecast({ daily }) {
  const formatter = new Intl.DateTimeFormat("es", { weekday: "short" });
  forecastEl.replaceChildren();

  // El primer día es hoy, ya cubierto por el bloque principal
  for (let i = 1; i < daily.time.length; i++) {
    const day = document.createElement("div");
    day.className = "forecast__day";

    const name = document.createElement("div");
    name.className = "forecast__name";
    name.textContent = formatter.format(new Date(`${daily.time[i]}T12:00:00`));

    const icon = document.createElement("span");
    icon.className = "forecast__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = Api.describe(daily.weather_code[i])[0];

    const max = document.createElement("span");
    max.className = "forecast__max";
    max.textContent = `${round(daily.temperature_2m_max[i])}°`;

    const min = document.createElement("span");
    min.className = "forecast__min";
    min.textContent = `${round(daily.temperature_2m_min[i])}°`;

    day.append(name, icon, max, min);
    forecastEl.append(day);
  }
  forecastEl.hidden = false;
}

async function search(name) {
  setStatus("Buscando…");
  try {
    const city = await Api.findCity(name);
    const data = await Api.getWeather(city);
    renderCurrent(city.label, data);
    renderForecast(data);
    setStatus("");
    try { localStorage.setItem("weather:last-city", name); } catch {}
  } catch (err) {
    currentEl.hidden = true;
    forecastEl.hidden = true;
    setStatus(err.message, true);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = cityInput.value.trim();
  if (name) search(name);
});

let last = "Sevilla";
try { last = localStorage.getItem("weather:last-city") || last; } catch {}
cityInput.value = last;
search(last);
