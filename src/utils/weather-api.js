import CustomError from "./errors.js";
import { ERROR_CODES } from "../constants/error.constants.js";
import config from "../config/index.js";

export async function getWeather(city) {
    const response = await fetch(`${config.WEATHER_API_URL}?city=${city}&key=${config.WEATHER_API_KEY}`);
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