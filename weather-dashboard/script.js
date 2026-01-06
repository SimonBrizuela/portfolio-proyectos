// Weather Dashboard - JavaScript
// Reemplaza 'YOUR_API_KEY' con tu clave de OpenWeatherMap

const API_KEY = 'f33a484cf794d08d0148764789aaba32'; // API key demo - Para uso personal obtén tu propia key en https://openweathermap.org/api
const API_BASE = 'https://api.openweathermap.org/data/2.5';

class WeatherApp {
    constructor() {
        this.recentCities = this.loadRecentCities();
        this.init();
    }

    init() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.locationBtn = document.getElementById('locationBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.weatherContent = document.getElementById('weatherContent');

        this.addEventListeners();
        this.renderRecentCities();
        
        // Cargar última ciudad buscada si existe
        if (this.recentCities.length > 0) {
            this.getWeatherByCity(this.recentCities[0]);
        }
    }

    addEventListeners() {
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        this.locationBtn.addEventListener('click', () => this.getWeatherByLocation());
    }

    handleSearch() {
        const city = this.cityInput.value.trim();
        if (city) {
            this.getWeatherByCity(city);
        }
    }

    async getWeatherByCity(city) {
        this.showLoading();
        this.hideError();

        try {
            const response = await fetch(
                `${API_BASE}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
            );

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 401) {
                    throw new Error('Invalid API key. Please get your own key from openweathermap.org/api');
                } else if (response.status === 404) {
                    throw new Error(`City "${city}" not found. Try another city name.`);
                } else {
                    throw new Error(errorData.message || 'Unable to fetch weather data');
                }
            }

            const data = await response.json();
            await this.displayWeather(data);
            this.addToRecentCities(city);
            
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    async getWeatherByLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by your browser');
            return;
        }

        this.showLoading();
        this.hideError();

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `${API_BASE}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=es`
                    );

                    if (!response.ok) {
                        throw new Error('Unable to fetch weather data');
                    }

                    const data = await response.json();
                    await this.displayWeather(data);
                    
                } catch (error) {
                    this.showError(error.message);
                } finally {
                    this.hideLoading();
                }
            },
            (error) => {
                this.hideLoading();
                this.showError('Unable to get your location');
            }
        );
    }

    async displayWeather(data) {
        // Current weather
        document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById('currentDate').textContent = new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('temperature').textContent = Math.round(data.main.temp);
        document.getElementById('description').textContent = data.weather[0].description;
        document.getElementById('feelsLike').textContent = Math.round(data.main.feels_like);
        document.getElementById('humidity').textContent = data.main.humidity;
        document.getElementById('windSpeed').textContent = Math.round(data.wind.speed * 3.6);
        document.getElementById('pressure').textContent = data.main.pressure;
        document.getElementById('visibility').textContent = (data.visibility / 1000).toFixed(1);
        
        const iconCode = data.weather[0].icon;
        const iconImg = document.getElementById('weatherIcon');
        iconImg.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        iconImg.alt = data.weather[0].description;

        // Show sports recommendation
        this.showSportsRecommendation(data);

        // Get 5-day forecast
        await this.getForecast(data.coord.lat, data.coord.lon);

        this.weatherContent.classList.remove('hidden');
    }

    showSportsRecommendation(data) {
        const temp = data.main.temp;
        const windSpeed = data.wind.speed * 3.6; // Convert to km/h
        const weatherMain = data.weather[0].main.toLowerCase();
        const humidity = data.main.humidity;
        
        let recommendation = '';
        let icon = '';
        let className = '';
        let activities = [];

        // Evaluate conditions for outdoor sports
        const tempIdeal = temp >= 15 && temp <= 25;
        const windLow = windSpeed < 20;
        const windModerate = windSpeed >= 20 && windSpeed < 35;
        const noRain = !['rain', 'drizzle', 'thunderstorm'].includes(weatherMain);
        const goodVisibility = data.visibility > 5000;

        // Cycling recommendations
        if (tempIdeal && windLow && noRain) {
            recommendation = '¡Perfecto para andar en bici! 🚴';
            icon = '🚴‍♂️';
            className = 'excellent';
            activities.push('Ciclismo', 'Running', 'Patinaje');
        } else if (temp >= 10 && temp <= 30 && windModerate && noRain) {
            recommendation = 'Buenas condiciones para ciclismo, pero atento al viento 🌬️';
            icon = '🚴';
            className = 'good';
            activities.push('Ciclismo moderado', 'Caminata');
        } else if (!noRain) {
            recommendation = 'No recomendado para ciclismo - Condiciones lluviosas ☔';
            icon = '☔';
            className = 'poor';
            activities.push('Gimnasio', 'Actividades indoor');
        } else if (temp < 10) {
            recommendation = 'Hace frío para ciclismo - Abrígate bien 🧥';
            icon = '❄️';
            className = 'fair';
            activities.push('Ciclismo con ropa térmica');
        } else if (temp > 30) {
            recommendation = 'Mucho calor para deportes intensos - Hidrátate bien 🌡️';
            icon = '☀️';
            className = 'fair';
            activities.push('Ciclismo temprano', 'Natación');
        } else if (windSpeed >= 35) {
            recommendation = 'Viento fuerte - No recomendado para ciclismo 💨';
            icon = '💨';
            className = 'poor';
            activities.push('Actividades indoor');
        } else {
            recommendation = 'Condiciones aceptables para actividades al aire libre';
            icon = '✓';
            className = 'fair';
            activities.push('Ciclismo', 'Caminata');
        }

        // Build recommendation HTML
        const recommendationHTML = `
            <div class="sports-card ${className}">
                <div class="sports-icon">${icon}</div>
                <div class="sports-content">
                    <h3>${recommendation}</h3>
                    <div class="sports-details">
                        <div class="sports-condition">
                            <span class="condition-label">🌡️ Temperatura:</span>
                            <span class="condition-value ${this.getTempClass(temp)}">${Math.round(temp)}°C</span>
                        </div>
                        <div class="sports-condition">
                            <span class="condition-label">💨 Viento:</span>
                            <span class="condition-value ${this.getWindClass(windSpeed)}">${Math.round(windSpeed)} km/h</span>
                        </div>
                        <div class="sports-condition">
                            <span class="condition-label">☀️ Condiciones:</span>
                            <span class="condition-value">${data.weather[0].description}</span>
                        </div>
                        <div class="sports-condition">
                            <span class="condition-label">💧 Humedad:</span>
                            <span class="condition-value">${humidity}%</span>
                        </div>
                    </div>
                    <div class="suggested-activities">
                        <strong>Actividades sugeridas:</strong> ${activities.join(', ')}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('sportsRecommendation').innerHTML = recommendationHTML;
    }

    getTempClass(temp) {
        if (temp >= 15 && temp <= 25) return 'excellent';
        if (temp >= 10 && temp <= 30) return 'good';
        return 'fair';
    }

    getWindClass(windSpeed) {
        if (windSpeed < 20) return 'excellent';
        if (windSpeed < 35) return 'good';
        return 'poor';
    }

    async getForecast(lat, lon) {
        try {
            const response = await fetch(
                `${API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
            );

            if (!response.ok) {
                throw new Error('Unable to fetch forecast data');
            }

            const data = await response.json();
            this.displayForecast(data);
            
        } catch (error) {
            console.error('Error getting forecast:', error);
        }
    }

    displayForecast(data) {
        const forecastContainer = document.getElementById('forecastContainer');
        forecastContainer.innerHTML = '';

        // Agrupar por día (tomar pronóstico del mediodía)
        const dailyForecasts = {};
        
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateKey = date.toLocaleDateString('es-ES');
            const hour = date.getHours();

            // Tomar el pronóstico cercano al mediodía
            if (hour >= 12 && hour <= 15 && !dailyForecasts[dateKey]) {
                dailyForecasts[dateKey] = item;
            }
        });

        // Mostrar los primeros 5 días
        Object.values(dailyForecasts).slice(0, 5).forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const card = document.createElement('div');
            card.className = 'forecast-card';
            
            card.innerHTML = `
                <div class="forecast-date">
                    ${date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                </div>
                <div class="forecast-icon">
                    <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png" alt="${forecast.weather[0].description}">
                </div>
                <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
                <div class="forecast-desc">${forecast.weather[0].description}</div>
            `;

            forecastContainer.appendChild(card);
        });
    }

    addToRecentCities(city) {
        // Eliminar si ya existe
        this.recentCities = this.recentCities.filter(c => c.toLowerCase() !== city.toLowerCase());
        // Agregar al inicio
        this.recentCities.unshift(city);
        // Mantener solo las últimas 5
        this.recentCities = this.recentCities.slice(0, 5);
        
        this.saveRecentCities();
        this.renderRecentCities();
    }

    renderRecentCities() {
        const container = document.getElementById('recentCities');
        container.innerHTML = '';

        if (this.recentCities.length === 0) {
            container.innerHTML = '<p style="color: #999;">No recent searches</p>';
            return;
        }

        this.recentCities.forEach(city => {
            const badge = document.createElement('span');
            badge.className = 'recent-city';
            badge.textContent = city;
            badge.addEventListener('click', () => {
                this.cityInput.value = city;
                this.getWeatherByCity(city);
            });
            container.appendChild(badge);
        });
    }

    showLoading() {
        this.loadingSpinner.classList.remove('hidden');
        this.weatherContent.classList.add('hidden');
    }

    hideLoading() {
        this.loadingSpinner.classList.add('hidden');
    }

    showError(message) {
        this.errorMessage.textContent = `Error: ${message}`;
        this.errorMessage.classList.remove('hidden');
        this.weatherContent.classList.add('hidden');
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }

    saveRecentCities() {
        localStorage.setItem('recentCities', JSON.stringify(this.recentCities));
    }

    loadRecentCities() {
        const cities = localStorage.getItem('recentCities');
        return cities ? JSON.parse(cities) : [];
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});
