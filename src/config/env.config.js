import dotenv from "dotenv";

dotenv.config();

const env = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV
};

if (!env.PORT) {
    throw new Error("Falta PORT en el .env");
}

if (!env.MONGODB_URI) {
    throw new Error("Falta MONGODB_URI en el .env");
}

if (!env.NODE_ENV) {
    throw new Error("Falta NODE_ENV en el .env");
}

export default env;