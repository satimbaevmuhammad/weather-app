// DOM elements
const wrapper = document.querySelector('.wrapper');
const inputText = document.querySelector('input');
const btn = document.querySelector('button');
const downloadBtn = document.getElementById('downloadBtn');
const iosInstructions = document.getElementById('ios-instructions');

// Check if there's a saved location in localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedLocation = localStorage.getItem('weatherLocation');
    if (savedLocation) {
        inputText.value = savedLocation;
        fetchWeather();
    }
    
    // PWA installation logic for the download button
    setupInstallButton();
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

// Set up PWA installation button
const setupInstallButton = () => {
    // Variables for PWA installation
    let deferredPrompt;

    // Check if device is iOS
    const isIOS = () => {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    };

    if (isIOS()) {
        // For iOS devices, show instructions for Add to Home Screen
        downloadBtn.textContent = "Install on iOS";
        downloadBtn.addEventListener('click', () => {
            iosInstructions.style.display = 'block';
        });
    } else {
        // For other platforms, use the standard install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            deferredPrompt = e;
        });

        downloadBtn.addEventListener('click', () => {
            if (deferredPrompt) {
                // Show the install prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                    deferredPrompt = null;
                });
            } else {
                alert("Installation not available. You may already have installed the app or your browser doesn't support PWA installation.");
            }
        });
    }

    // Hide the install button when the PWA is already installed
    window.addEventListener('appinstalled', (evt) => {
        downloadBtn.textContent = "App Installed";
        downloadBtn.disabled = true;
        console.log('Weather PWA was installed');
    });
};

// Event listeners for weather search
btn.addEventListener("click", fetchWeather);

// Also search when Enter key is pressed
inputText.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        fetchWeather();
    }
});