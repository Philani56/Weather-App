import React, { useEffect, useState } from 'react';
import './Weather.css';
import search_icon from '../Assets/search.png';
import clear_icon from '../Assets/clear.png';
import cloud_icon from '../Assets/cloud.png';
import drizzle_icon from '../Assets/drizzle.png';
import rain_icon from '../Assets/rain.png';
import snow_icon from '../Assets/snow.png';
import wind_icon from '../Assets/wind.png';
import humidity_icon from '../Assets/humidity.png';

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null); // Weather data or null
    const [city, setCity] = useState('London'); // Default city
    const [error, setError] = useState(''); // Error message state

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon
    };

    const search = async (city) => {
        try {
            setError(''); // Clear any previous error message
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('City not found');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            const data = await response.json();
            const icon = allIcons[data.weather[0].icon] || clear_icon; // Get the correct icon

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            }); // Save data to state

        } catch (error) {
            console.error('Error fetching weather data:', error);
            setWeatherData(null); // Clear weather data
            setError(error.message); // Set the error message
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            search(city); // Call the search function when Enter key is pressed
        }
    };

    useEffect(() => {
        search(city); // Fetch default weather data for London on mount
    }, []);

    return (
        <div className='weather'>
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder='Search city' 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    onKeyPress={handleSearch} 
                />
                <img src={search_icon} alt="Search Icon" onClick={() => search(city)} />
            </div>

            {error && <p className='error-message'>{error}</p>} {/* Show error message if there's an error */}

            {weatherData && (
                <>
                    <img src={weatherData.icon} alt="weather-icon" />
                    <p className='temperature'>{weatherData.temperature}°C</p>
                    <p className='location'>{weatherData.location}</p>
                    <div className="weather-data">
                        <div className="col">
                            <img src={humidity_icon} alt="Humidity Icon" />
                            <div>
                                <p>{weatherData.humidity} %</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={wind_icon} alt="Wind Icon" />
                            <div>
                                <p>{weatherData.windSpeed} Km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Weather;
