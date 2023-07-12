function changeCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector(".city-input");
  let header = document.querySelector(".main-city");
  if (cityInput.value) {
    header.innerHTML = `${cityInput.value}`;
  }
  let apiKey = `fda3688b1db05987dd5d07c237aecfba`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);
}

function getForecast(coordinates) {
  let apiKey = `6e6ec494746b5229a9f2d526478c924c`;
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function showWeather(response) {
  celsiusTemperature = response.data.main.temp;
  celsiusTempMax = response.data.main.temp_max;
  celsiusTempMin = response.data.main.temp_min;
  celsiusFeelsLike = response.data.main.feels_like;
  let tempElement = document.querySelector("#celsius-degrees");
  tempElement.innerHTML = Math.round(response.data.main.temp);
  let tempMax = document.querySelector("#highest-temp");
  tempMax.innerHTML = Math.round(response.data.main.temp_max);
  let tempMin = document.querySelector("#lowest-temp");
  tempMin.innerHTML = Math.round(response.data.main.temp_min);
  let weatherCondition = document.querySelector("#weather-description");
  weatherCondition.innerHTML = `${
    response.data.weather[0].description.charAt(0).toUpperCase() +
    response.data.weather[0].description.slice(1)
  }`;
  let iconElement = document.querySelector("#main-image");
  iconElement.setAttribute(
    "src",
    `sources/images/weather-icons/${response.data.weather[0].icon}.png`
  );
  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `${Math.round(response.data.main.humidity)}%`;
  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = `${Math.round(response.data.wind.speed * 3.6)} km/h`;

  getForecast(response.data.coord);
}

function getUserLocation(event) {
  navigator.geolocation.getCurrentPosition(changeToUser);
  function changeToUser(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiKey = `fda3688b1db05987dd5d07c237aecfba`;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    axios.get(apiUrl).then(changeUserData);
  }
}

function changeUserData(response) {
  celsiusTemperature = response.data.main.temp;
  celsiusTempMax = response.data.main.temp_max;
  celsiusTempMin = response.data.main.temp_min;
  let header = document.querySelector(".main-city");
  header.innerHTML = response.data.name;
  const temp = Math.round(response.data.main.temp);
  let tempElement = document.querySelector("#celsius-degrees");
  tempElement.innerHTML = temp;
  let weatherCondition = document.querySelector("#weather-description");
  weatherCondition.innerHTML = `${
    response.data.weather[0].description.charAt(0).toUpperCase() +
    response.data.weather[0].description.slice(1)
  }`;
}

function showFarenheitTemp(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#celsius-degrees");
  let farenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(farenheitTemp);
  let maxTempElement = document.querySelector("#highest-temp");
  let maxFarenheitTemp = (celsiusTempMax * 9) / 5 + 32;
  maxTempElement.innerHTML = Math.round(maxFarenheitTemp);
  let minTempElement = document.querySelector("#lowest-temp");
  let minFarenheitTemp = (celsiusTempMin * 9) / 5 + 32;
  minTempElement.innerHTML = Math.round(minFarenheitTemp);
  let feelsLikeElement = document.querySelector("#feels-like");
  let farenheitFeelsLike = (celsiusFeelsLike * 9) / 5 + 32;
  feelsLikeElement.innerHTML = Math.round(farenheitFeelsLike);
  celsiusLink.classList.remove("active");
  farenheitLink.classList.add("active");
}

function showCelsiusTemp(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#celsius-degrees");
  tempElement.innerHTML = Math.round(celsiusTemperature);
  let maxTempElement = document.querySelector("#highest-temp");
  maxTempElement.innerHTML = Math.round(celsiusTempMax);
  let minTempElement = document.querySelector("#lowest-temp");
  minTempElement.innerHTML = Math.round(celsiusTempMin);
  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = Math.round(celsiusFeelsLike);
  celsiusLink.classList.add("active");
  farenheitLink.classList.remove("active");
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2" id="forecast-element">
            <div class="forecast-day">${formatDate(forecastDay.dt)}</div>
            <div class="forecast-image">
              <img
                src="sources/images/weather-icons/${
                  forecastDay.weather[0].icon
                }.png"
                alt="Weather Stand Cloud"
                id="forecast-image"
              />
            </div>
            <div class="forecast-temps">
              <span class="forecast-max"
                ><span id="forecast-max-degrees">${Math.round(
                  forecastDay.temp.max
                )}</span>°</span
              >
              <span class="forecast-min"
                ><span id="forecast-min-degrees">${Math.round(
                  forecastDay.temp.min
                )}</span>°</span
              >
            </div>
          </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

let celsiusTemperature = null;
let celsiusTempMax = null;
let celsiusTempMin = null;
let celsiusFeelsLike = null;

let city = "Berlin";
let apiKey = `fda3688b1db05987dd5d07c237aecfba`;
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
axios.get(apiUrl).then(showWeather);

let userLocationButton = document.querySelector(".location-button");
userLocationButton.addEventListener("click", getUserLocation);

let userCity = document.querySelector("#search-form");
userCity.addEventListener("click", changeCity);

let userDate = document.querySelector(".date");
let currentTime = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[currentTime.getDay()];
let hours = currentTime.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = currentTime.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
userDate.innerHTML = `${day} ${hours}:${minutes}`;

let farenheitLink = document.querySelector("#farenheit-link");
farenheitLink.addEventListener("click", showFarenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemp);

displayForecast();
