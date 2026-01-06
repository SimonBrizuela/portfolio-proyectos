# Weather Dashboard

Real-time weather dashboard with 5-day forecast and **outdoor sports recommendations** using the OpenWeatherMap API.

## ✨ Features

- 🔍 Weather search by city
- 📍 Automatic location detection (geolocation)
- 📅 Extended 5-day forecast with high-quality icons
- 🚴 **Smart recommendations for outdoor activities** (cycling, running, sports)
- 💨 Intelligent analysis of wind, temperature, and weather conditions
- 📊 Detailed information (temperature, humidity, wind, pressure, visibility)
- 🎨 Modern glassmorphism interface with smooth animations
- 📱 Fully responsive design
- 💾 Recent search history
- 🌤️ High-resolution weather icons from OpenWeatherMap

## Technologies

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript ES6+ (Async/Await, Fetch API, Geolocation API)
- OpenWeatherMap API

## Configuration

1. Get a free API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Open `script.js`
3. Replace `'YOUR_API_KEY'` with your personal key:
   ```javascript
   const API_KEY = 'your_api_key_here';
   ```
4. Open `index.html` in your browser

## How to Use

1. **Search by city**: Type a city name and press Enter or click "Search"
2. **Current location**: Click "Use My Location" to get weather for your current location
3. **Recent searches**: Click any city in history to view its weather again
4. **Sports recommendations**: Check the recommendation card to see if conditions are ideal for cycling, running, or outdoor activities

## 🚴 Sports Recommendation System

The app analyzes multiple weather factors to provide intelligent recommendations for outdoor activities:

### Evaluation Criteria
- **Temperature**: Ideal range 15-25°C
- **Wind speed**: Best under 20 km/h, acceptable up to 35 km/h
- **Weather conditions**: Rain, storms, and extreme conditions are detected
- **Humidity**: Monitored for comfort assessment
- **Visibility**: Checked for safe outdoor activities

### Recommendation Levels
- 🟢 **Excellent** (Green): Perfect conditions for cycling, running, skating
- 🔵 **Good** (Blue): Suitable conditions with minor precautions (wind awareness)
- 🟡 **Fair** (Yellow): Acceptable but challenging (cold/hot, dress appropriately)
- 🔴 **Poor** (Red): Not recommended (rain, strong winds, extreme temperatures)

### Activity Suggestions
Based on current conditions, the app suggests:
- Cycling (road or mountain)
- Running / Jogging
- Skating
- Walking / Hiking
- Swimming (on hot days)
- Indoor alternatives (when conditions are poor)

## 💻 Concepts Demonstrated

- **REST API Integration**: Consuming external APIs with Fetch
- **Async/Await**: Handling asynchronous operations
- **Geolocation API**: Getting user's location
- **Error Handling**: Robust error management with detailed messages
- **LocalStorage**: Persisting recent searches
- **Responsive Design**: Adaptation to different screen sizes
- **Loading States**: Loading indicators and error messages
- **Conditional Logic**: Smart recommendation system based on multiple factors
- **Dynamic UI**: Real-time content updates based on API data
- **Glassmorphism Design**: Modern UI with backdrop filters and transparency

## 🌟 Highlighted Features

- **Smart Sports Advisor**: Evaluates temperature, wind, humidity, and conditions
- **High-Resolution Icons**: Using @4x images for crystal-clear weather icons
- **Automatic Unit Conversion**: Wind in km/h, visibility in km, temperature in Celsius
- **Intelligent Forecast Filtering**: Shows midday data for accurate daily forecasts
- **Smooth Animations**: Fade-in effects and hover transitions
- **Color-Coded Recommendations**: Visual feedback (green/blue/yellow/red) for conditions
- **Multi-Sport Support**: Recommendations for cycling, running, skating, and more
- **Localized Dates**: Spanish language format for dates and descriptions
- **Glassmorphism UI**: Modern design with blur effects and semi-transparent cards

## 📝 Important Notes

This application requires an OpenWeatherMap API key. The free plan includes:
- 60 calls per minute
- 1,000,000 calls per month
- Current weather data
- 5-day forecast
- High-resolution weather icons

## 🎯 Use Cases

Perfect for:
- 🚴 **Cyclists** planning their routes
- 🏃 **Runners** choosing the best time to exercise
- 🏃‍♀️ **Athletes** training outdoors
- 🎒 **Hikers** planning outdoor activities
- 🛴 **Skaters** looking for ideal conditions
- 👨‍👩‍👧‍👦 **Families** planning outdoor activities with kids

## 🔮 Future Enhancements

Potential improvements:
- UV index recommendations for sun protection
- Air quality index (AQI) for respiratory health
- Hourly forecasts for precise planning
- Customizable thresholds for personal preferences
- Weekly/monthly statistics and trends
- Push notifications for ideal conditions
- Integration with cycling/running routes

---

**Project developed to demonstrate REST API integration and smart recommendation systems**

Made with ❤️ for outdoor sports enthusiasts
