const apiKey = '8a04c5f98c13fbd952e390c6e5b010b2'; // Replace with your OpenWeatherMap API key

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherContainer = document.getElementById('current-weather');
const forecastContainer = document.getElementById('forecast');
const searchHistoryContainer = document.getElementById('search-history');

searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city !== '') {
    searchWeather(city);
    cityInput.value = '';
    saveToLocalStorage(city);
  }
});

searchHistoryContainer.addEventListener('click', function(event) {
  if (event.target.tagName === 'BUTTON') {
    const city = event.target.textContent;
    searchWeather(city);
  }
});

function searchWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.cod === '200') {
        displayCurrentWeather(data);
        displayForecast(data);
        addSearchHistory(city);
      } else {
        showError(data.message);
      }
    })
    .catch(error => {
      showError('An error occurred. Please try again.');
      console.error(error);
    });
}

function displayCurrentWeather(data) {
  const currentWeather = data.list[0];
  const city = data.city.name;
  const date = formatDate(currentWeather.dt);
  const icon = currentWeather.weather[0].icon;
  const temperature = currentWeather.main.temp;
  const humidity = currentWeather.main.humidity;
  const windSpeed = currentWeather.wind.speed;

  const currentWeatherHtml = `
    <div class="weather-card">
      <h2>${city}</h2>
      <p>Date: ${date}</p>
      <img src="https://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
      <p>Temperature: ${temperature} °C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
    </div>
  `;

  currentWeatherContainer.innerHTML = currentWeatherHtml;
}

function displayForecast(data) {
  const forecastList = data.list.slice(1, 6); // Get the next 5-day forecast

  let forecastHtml = '';
  forecastList.forEach(forecast => {
    const date = formatDate(forecast.dt);
    const icon = forecast.weather[0].icon;
    const temperature = forecast.main.temp;
    const humidity = forecast.main.humidity;
    const windSpeed = forecast.wind.speed;

    forecastHtml += `
      <div class="weather-card">
        <h3>${date}</h3>
        <img src="https://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">
        <p>Temperature: ${temperature} °C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      </div>
    `;
  });

  forecastContainer.innerHTML = forecastHtml;
}

function addSearchHistory(city) {
  const searchHistoryHtml = `
    <button>${city}</button>
  `;

  searchHistoryContainer.innerHTML += searchHistoryHtml;
}

function showError(message) {
  const errorHtml = `
    <div class="error">${message}</div>
  `;

  currentWeatherContainer.innerHTML = errorHtml;
  forecastContainer.innerHTML = '';
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

function saveToLocalStorage(city) {
  let searchHistory = localStorage.getItem('searchHistory');
  searchHistory = searchHistory ? JSON.parse(searchHistory) : [];
  searchHistory.push(city);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Load data from local storage on page load
function loadFromLocalStorage() {
  const searchHistory = localStorage.getItem('searchHistory');
  if (searchHistory) {
    const cities = JSON.parse(searchHistory);
    cities.forEach(city => {
      addSearchHistory(city);
    });
  }
}

loadFromLocalStorage();
