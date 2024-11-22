//INSTALL NODE
//Execute by command: node Weather.js

//City map coordinates by name
async function fetchCoordinates(city) {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=139b4bb6580ff128548947862f70dd7f`);
        const data = await response.json();
        if (data.length > 0) {
            const { lat, lon } = data[0];
            return { lat, lon };
        } else {
            throw new Error('City not found');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
    }
}
// Request weather by coordinates
async function getWeather(city) {
    try {
        const coordinates = await fetchCoordinates(city);
        if (coordinates) {
            const fetch = (await import('node-fetch')).default;
            const { lat, lon } = coordinates;
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=139b4bb6580ff128548947862f70dd7f`);
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}
//Parse and compute response
function extractWeatherInfo(data, city) {
    if (data) {
        const temperatureC = data.main.temp - 273.15; // Convert Kelvin to Celsius
        const currentDate = new Date().toISOString().split('T')[0]; // Get the current date
        return {
            date: currentDate,
            city: city,
            temperatureC: temperatureC.toFixed(2), // Limiting to 2 decimal places
            weatherDescription: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        };
    } else {
        console.error('No data to display');
    }
}

// Send POST to MockAPI
async function sendWeather(city) {
    const weatherData = await getWeather(city);
    if (weatherData) {
        const weatherInfo = extractWeatherInfo(weatherData, city);

        try {
            const fetch = (await import('node-fetch')).default;
            const response = await fetch('https://6740829dd0b59228b7f05221.mockapi.io/Weather', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify(weatherInfo)
            });
            const result = await response.json();
            console.log('Data sent successfully:', result);
        } catch (error) {
            console.error('Error sending data:', error);
        }
    }
}
// Execute function
sendWeather('London');
