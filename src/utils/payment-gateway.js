import CustomError from "./errors.js";
import { ERROR_CODES } from "../constants/error.constants.js";

const PAYMENT_API_URL = 'https://api.stripe.com/v1/charges';

export async function charge(amount, paymentMethod) {
    const response = await fetch(PAYMENT_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk_test_real_key'
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