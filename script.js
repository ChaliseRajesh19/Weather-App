const cityInput = document.getElementById("cityname");

const dayEl = document.querySelector(".day");
const dateEl = document.querySelector(".date");
const locationEl = document.querySelector(".location");

const precipEl = document.querySelector(".precipitate");
const humidityEl = document.querySelector(".humidity");
const windEl = document.querySelector(".wind-Speed");
const iconEl = document.querySelector(".weather-icon");
const tempEl = document.querySelector(".temperature");

const forecast = document.querySelector(".forecast")


const apiKey = "c7bc282751dba55096dfeaf1cb99635e";

// ENTER key search
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city !== "") {
      getWeather(city);
    }
  }
});

async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      alert("City not found");
      return;
    }

    const data = await response.json();
    updateUI(data);

    // Call forecast
    const forecastData = await getForecast(city);
    showForecast(forecastData);

  } catch (error) {
    alert("Something went wrong");
  }
}

function updateUI(data) {
  locationEl.innerText = `${data.name}, ${data.sys.country}`;

  const now = new Date();
  dayEl.innerText = now.toLocaleDateString("en-US", { weekday: "long" });
  dateEl.innerText = now.toLocaleDateString();

  // Right info (ICON + TEMP)
  const icon = data.weather[0].icon;
  iconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  tempEl.innerText = `${Math.round(data.main.temp)}°C`;


  precipEl.innerText = `Weather: ${data.weather[0].description}`;
  humidityEl.innerText = `Humidity: ${data.main.humidity}%`;
  windEl.innerText = `Wind Speed: ${data.wind.speed} km/h`;

}


async function getForecast(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
  );

  if (!response.ok) {
    alert("Forecast not found");
    return;
  }

  const data = await response.json();
  return data;
}


function showForecast(data) {
  forecast.innerHTML = ""; // Clear previous forecast

  // data.list has weather every 3 hours, take one per day at 12:00
  const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  dailyData.forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const temp = Math.round(day.main.temp);
    const desc = day.weather[0].description;
    const icon = day.weather[0].icon;

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h4>${dayName}</h4>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
      <p>${temp}°C</p>
      <p>${desc}</p>
    `;

    forecast.appendChild(card);
  });
}
