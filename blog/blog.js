document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'd5ee6d9ca4eb22cf6211b04e54877d89';
    const city = 'Srinagar'; // City name
    const lat = '34.0836';   // Latitude for Srinagar
    const lon = '74.7973';   // Longitude for Srinagar
    const units = 'metric';  // Celsius

    function fetchWeather() {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
        const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        fetch(weatherUrl)
            .then(response => response.json())
            .then(weatherData => {
                const temperature = weatherData.main.temp;
                const weatherDescription = weatherData.weather[0].description;
                const humidity = weatherData.main.humidity;
                const windSpeed = weatherData.wind.speed;
                
                fetch(airQualityUrl)
                    .then(response => response.json())
                    .then(airQualityData => {
                        const aqi = airQualityData.list[0].main.aqi;
                        const airQualityDescription = getAirQualityDescription(aqi);
                        document.getElementById('weather-info').innerHTML = `
                            <p>Temperature: ${temperature}°C</p>
                            <p>Condition: ${weatherDescription}</p>
                            <p>Humidity: ${humidity}%</p>
                            <p>Wind Speed: ${windSpeed} m/s</p>
                            <p>Air Quality Index: ${aqi} (${airQualityDescription})</p>
                        `;
                    })
                    .catch(error => {
                        console.error('Error fetching air quality data:', error);
                        document.getElementById('weather-info').innerHTML = '<p>Unable to fetch air quality data at the moment.</p>';
                    });
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                document.getElementById('weather-info').innerHTML = '<p>Unable to fetch weather data at the moment.</p>';
            });
    }

    function fetchHourlyForecast() {
        const hourlyUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=daily,minutely&units=metric&appid=${apiKey}`;

        fetch(hourlyUrl)
            .then(response => response.json())
            .then(data => {
                const hourlyForecast = data.hourly.slice(0, 12).map(hour => {
                    const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return `
                        <p>${time}: ${hour.temp}°C, ${hour.weather[0].description}</p>
                    `;
                }).join('');

                document.getElementById('hourly-forecast').innerHTML = hourlyForecast;
            })
            .catch(error => {
                console.error('Error fetching hourly forecast data:', error);
                document.getElementById('hourly-forecast').innerHTML = '<p>Unable to fetch hourly forecast data at the moment.</p>';
            });
    }

    function fetchWeatherAlerts() {
        const alertsUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=daily,minutely,hourly&appid=${apiKey}`;
        fetch(alertsUrl)
            .then(response => response.json())
            .then(data => {
                if (data.alerts && data.alerts.length > 0) {
                    const alerts = data.alerts.map(alert => {
                        return `<p><strong>${alert.event}:</strong> ${alert.description}</p>`;
                    }).join('');
                    document.getElementById('weather-alerts').innerHTML = alerts;
                } else {
                    document.getElementById('weather-alerts').innerHTML = '<p>No weather alerts.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching weather alerts:', error);
                document.getElementById('weather-alerts').innerHTML = '<p>Unable to fetch weather alerts at the moment.</p>';
            });
    }

    function fetchUVIndex() {
        const uvIndexUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=daily,minutely,hourly&appid=${apiKey}`;
        fetch(uvIndexUrl)
            .then(response => response.json())
            .then(data => {
                const uvIndex = data.current.uvi;
                document.getElementById('uv-index').innerHTML = `<p>UV Index: ${uvIndex}</p>`;
            })
            .catch(error => {
                console.error('Error fetching UV Index data:', error);
                document.getElementById('uv-index').innerHTML = '<p>Unable to fetch UV Index data at the moment.</p>';
            });
    }
    function fetchSunTimes() {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                document.getElementById('sun-times').innerHTML = 
                `<p>Sunrise: ${sunrise}</p><p>Sunset: ${sunset}</p>`;
            })
            .catch(error => {
                console.error('Error fetching sunrise and sunset data:', error);
                document.getElementById('sun-times').innerHTML =
                 '<p>Unable to fetch sunrise and sunset times at the moment.</p>';
            });
    }

    function getAirQualityDescription(aqi) {
        switch(aqi) {
            case 1: return 'Good';
            case 2: return 'Fair';
            case 3: return 'Moderate';
            case 4: return 'Poor';
            case 5: return 'Very Poor';
            default: return 'Unknown';
        }
    }
    fetchWeather();
    fetchHourlyForecast();
    fetchWeatherAlerts();
    fetchUVIndex();
    fetchSunTimes();
});
