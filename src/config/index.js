import dotenv from "dotenv";

const nodeEnv = process.env.NODE_ENV || "development";

if (nodeEnv !== "production") {
    dotenv.config({
        path: nodeEnv === "test"
            ? ".env.test"
            : ".env"
    });
}

const requiredEnvVars = [
    "PORT",
    "MONGODB_URI",
    "NODE_ENV",
    "LOG_LEVEL"
];

if (nodeEnv !== "test") {
    requiredEnvVars.push(
        "PAYMENT_API_URL",
        "PAYMENT_API_KEY",
        "NOTIFICATION_API_URL",
        "WEATHER_API_URL",
        "WEATHER_API_KEY"
    );
}

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Falta configurar la variable de entorno: ${envVar}`);
    }
});

const config = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV,
    LOG_LEVEL: process.env.LOG_LEVEL,

    PAYMENT_API_URL: process.env.PAYMENT_API_URL,
    PAYMENT_API_KEY: process.env.PAYMENT_API_KEY,
    NOTIFICATION_API_URL: process.env.NOTIFICATION_API_URL,
    WEATHER_API_URL: process.env.WEATHER_API_URL,
    WEATHER_API_KEY: process.env.WEATHER_API_KEY
};

export default config;