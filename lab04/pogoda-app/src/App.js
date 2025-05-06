import React, { useState, useEffect } from 'react';
import './App.css';

const apiKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const getWeather = async () => {
    if (!city.trim()) {
      alert('Proszę wpisać nazwę miasta');
      return;
    }
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${apiKey}&units=
metric&lang=pl`
      );
      if (!response.ok) {
        throw new Error(`Błąd HTTP: ${response.status}`);
      }
      const data = await response.json();
      if (!data || !data.weather || data.weather.length === 0) {
        alert('Nie udało się pobrać danych pogodowych.');
        return;
      }
      setWeatherData(data);
    } catch (error) {
      console.error('Błąd:', error);
      alert(error.message || 'Wystąpił błąd podczas pobierania danych');
    }
  };
  return (
    <div className="App">
      <h1>Prognoza pogody</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Wpisz nazwę miasta"
      />
      <button onClick={getWeather}>Sprawdź pogodę</button>
      {weatherData && (
        <div id="weatherInfo">
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <p>{weatherData.weather[0].description}</p>
          <p>Temperatura: {weatherData.main.temp}°C</p>
          <p>Ciśnienie: {weatherData.main.pressure} hPa</p>
          <p>Wilgotność: {weatherData.main.humidity}%</p>
          <p>Prędkość wiatru: {weatherData.wind.speed} m/s</p> </div>
      )}
    </div>
  );
}
export default App;