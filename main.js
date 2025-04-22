// DOM elements
const wrapper = document.querySelector('.wrapper');
const inputText = document.querySelector('input');
const btn = document.querySelector('button');

// Check if there's a saved location in localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedLocation = localStorage.getItem('weatherLocation');
    if (savedLocation) {
        inputText.value = savedLocation;
        fetchWeather();
    }
});

// Fetch weather data from API
const fetchWeather = () => {
    if (!inputText.value) {
        displayError("Please enter a location");
        return;
    }

    // Show loading state
    wrapper.innerHTML = '<p>Loading weather data...</p>';

    const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${inputText.value}&days=3`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '94731c3364mshe538933d9933a31p127510jsnf714b17a30f6',
            'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
        }
    };

    fetch(url, options)
        .then(res => {
            if (!res.ok) {
                throw new Error('Location not found or API error');
            }
            return res.json();
        })
        .then(data => {
            // Save location to localStorage
            localStorage.setItem('weatherLocation', inputText.value);

            displayWeather(data);
        })
        .catch(error => {
            displayError(error.message);
        });
};

// Display weather data in the UI
const displayWeather = (data) => {
    wrapper.innerHTML = `
        <div class="weather-data">
            <div class="location">${data.location.name}, ${data.location.country}</div>
            <div class="temperature">${data.current.temp_c}°C</div>
            <div class="condition">
                <img src="${data.current.condition.icon}" alt="${data.current.condition.text}">
                <span>${data.current.condition.text}</span>
            </div>
            <div class="details">
                <p>Feels like: ${data.current.feelslike_c}°C</p>
                <p>Humidity: ${data.current.humidity}%</p>
                <p>Wind: ${data.current.wind_kph} km/h</p>
            </div>
        </div>
    `;
};

// Display error messages
const displayError = (message) => {
    wrapper.innerHTML = `<p style="color: red;">Error: ${message}</p>`;
};

// Event listeners
btn.addEventListener("click", fetchWeather);

// Also search when Enter key is pressed
inputText.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        fetchWeather();
    }
});