import React, { useState, useEffect } from 'react';
import './App.css';
import { WiDaySunny, WiRain, WiSnow, WiCloudy, WiThunderstorm, WiFog } from 'react-icons/wi';

const weatherConditions = {
  Thunderstorm: {
    color: '#616161',
    title: 'Burza',
    subtitle: 'Uważaj na błyskawice!',
    icon: <WiThunderstorm size={64} />
  },
  Drizzle: {
    color:
      '#0044CC', title:
      'Mżawka', subtitle:
      'Lekkie opady',
    icon: <WiRain size={64} />
  },
  Rain: {
    color:
      '#005BEA', title:
      'Deszcz', subtitle: 'Weź parasol',
    icon: < WiRain size={64} />
  },
  Snow: {
    color:
      '#00d2ff', title:
      'Śnieg',
    subtitle: 'Ubierz się ciepło',
    icon: <WiSnow size={64} />
  },
  Clear: {
    color: '#f7b733',
    title: 'Słonecznie', subtitle:
      'Idealna pogoda!',
    icon: <WiDaySunny size={64} />
  },
  Clouds: {
    color:
      '#1F1C2C', title:
      'Pochmurno',
    subtitle: 'Może przejaśni się później',
    icon: <WiCloudy size={64} />
  },
  Mist: {
    color:
      '#3CD3AD',
    title: 'Mgła',
    subtitle: 'Uważaj na drodze',
    icon: <WiFog size={64} />
  }
};

const apiKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const getLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=pl`
          )
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              setWeatherData(data);
            })
            .catch((error) => {
              console.error('Error fetching weather data:', error);
            });
        },
        (error) => {
          console.error('Geolocation error:', error);
          if (error.code === error.PERMISSION_DENIED) {
            alert('Aby pobrać pogodę dla Twojej lokalizacji, musisz zezwolić na dostęp do lokalizacji.');
          } else {
            alert(`Błąd geolokalizacji: ${error.message}`);
          }
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
      alert('Twoja przeglądarka nie wspiera geolokalizacji');
    }
  };

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
        alert('Nie udało się pobrać danych pogodowych.'); return;
      }
      setWeatherData(data);
    } catch (error) {
      console.error('Błąd:', error);
      alert(error.message || 'Wystąpił błąd podczas pobierania danych');
    }
  };
  const condition = weatherData && weatherData.weather && weatherData.weather[0] && weatherData.country
    ? weatherConditions[weatherData.weather[0].main] || weatherConditions.Clear
    : weatherConditions.Clear;
  return (
    <div className="App" style={{ backgroundColor: condition.color }}>
      <h1>{condition.title}</h1>
      <h2>{condition.subtitle}</h2>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Wpisz nazwę miasta"
      />
      <button onClick={getWeather}>Sprawdź pogodę</button>
      <button onClick={getLocationWeather}>Sprawdź pogodę dla Twojej lokalizacji</button>
      {weatherData && (
        <div id="weatherInfo">
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <div>{condition.icon} <p>{weatherData.weather[0].description}</p></div>
          <p>Temperatura: {weatherData.main.temp}°C</p>
          <p>Ciśnienie: {weatherData.main.pressure} hPa</p>
          <p>Wilgotność: {weatherData.main.humidity}%</p>
          <p>Prędkość wiatru: {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}
export default App;