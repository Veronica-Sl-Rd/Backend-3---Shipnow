import CustomError from "./errors.js";
import { ERROR_CODES } from "../constants/error.constants.js";
import config from "../config/index.js";

export async function charge(amount, paymentMethod) {
    const response = await fetch(config.PAYMENT_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.PAYMENT_API_KEY}`
        },
        body: JSON.stringify({ amount, currency: 'usd', payment_method: paymentMethod })
    });

    if (!response.ok) {
        throw new CustomError(ERROR_CODES.PAYMENT_REJECTED);
    }

    const data = await response.json();
    return {
        success: true,
        transactionId: data.id,
        amount
    };
}