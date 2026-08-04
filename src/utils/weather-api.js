import CustomError from "./errors.js";
import { ERROR_CODES } from "../constants/error.constants.js";

const WEATHER_API_URL = 'https://api.weather.com/v1/current';

export async function getWeather(city) {
    const response = await fetch(`${WEATHER_API_URL}?city=${city}&key=fake_weather_key`);

    if (!response.ok) {
        throw new CustomError(ERROR_CODES.WEATHER_API_ERROR);
    }

    const data = await response.json();
    return {
        city: data.location.name,
        condition: data.current.condition,
        temp: data.current.temp
    };
}