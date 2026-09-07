import CustomError from "./errors.js";
import { ERROR_CODES } from "../constants/error.constants.js";
import config from "../config/index.js";

export async function sendNotification(userId, message) {
    const response = await fetch(config.NOTIFICATION_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message })
    });

    if (!response.ok) {
        throw new CustomError(ERROR_CODES.NOTIFICATION_FAILED);
    }

    return { sent: true, userId, message };
}