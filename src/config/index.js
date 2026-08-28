import dotenv from "dotenv";

dotenv.config({
    path: process.env.NODE_ENV === "test"
        ? ".env.test"
        : ".env"
});

const requiredEnvVars = ["MONGODB_URI"];

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Falta configurar la variable de entorno: ${envVar}`);
    }
});

const config = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV || "development",
};

export default config;