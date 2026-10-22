const Api = (() => {
  const GEO = "https://geocoding-api.open-meteo.com/v1/search";
  const FORECAST = "https://api.open-meteo.com/v1/forecast";

  // Códigos WMO: https://open-meteo.com/en/docs
  const CODES = {
    0: ["☀️", "Despejado"],
    1: ["🌤️", "Mayormente despejado"],
    2: ["⛅", "Parcialmente nublado"],
    3: ["☁️", "Nublado"],
    45: ["🌫️", "Niebla"],
    48: ["🌫️", "Niebla con escarcha"],
    51: ["🌦️", "Llovizna ligera"],
    53: ["🌦️", "Llovizna"],
    55: ["🌦️", "Llovizna intensa"],
    61: ["🌧️", "Lluvia ligera"],
    63: ["🌧️", "Lluvia"],
    65: ["🌧️", "Lluvia fuerte"],
    71: ["🌨️", "Nieve ligera"],
    73: ["🌨️", "Nieve"],
    75: ["❄️", "Nieve fuerte"],
    80: ["🌦️", "Chubascos"],
    81: ["🌧️", "Chubascos fuertes"],
    82: ["⛈️", "Chubascos violentos"],
    95: ["⛈️", "Tormenta"],
    96: ["⛈️", "Tormenta con granizo"],
    99: ["⛈️", "Tormenta fuerte con granizo"],
  };

  const describe = (code) => CODES[code] || ["🌡️", "Sin datos"];

  async function getJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status} al consultar el servicio`);
    return res.json();
  }

  async function findCity(name) {
    const url = `${GEO}?name=${encodeURIComponent(name)}&count=1&language=es&format=json`;
    const data = await getJson(url);
    if (!data.results?.length) throw new Error(`No se encontró "${name}"`);
    const { latitude, longitude, name: city, country } = data.results[0];
    return { latitude, longitude, label: country ? `${city}, ${country}` : city };
  }

  async function getWeather({ latitude, longitude }) {
    const params = new URLSearchParams({
      latitude,
      longitude,
      current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
      daily: "weather_code,temperature_2m_max,temperature_2m_min",
      timezone: "auto",
      forecast_days: 6,
    });
    return getJson(`${FORECAST}?${params}`);
  }

  return { findCity, getWeather, describe };
})();
