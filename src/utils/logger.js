import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import config from "../config/index.js";

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}] ${message}`;
});

const levels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
};

winston.addColors({
    fatal: "red",
    error: "red",
    warning: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue"
});

const transports = [
    new DailyRotateFile({
        filename: "logs/combined.log",
        datePattern: "YYYY-MM-DD",
        maxFiles: "14d",
        zippedArchive: true
    }),
    new DailyRotateFile({
        filename: "logs/error.log",
        datePattern: "YYYY-MM-DD",
        level: "error",
        maxFiles: "14d",
        zippedArchive: true
    })
];

if (config.NODE_ENV === "development") {
    transports.push(
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                logFormat
            )
        })
    );
}

const logger = winston.createLogger({
    levels,
    level: config.LOG_LEVEL,
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),
    transports
});

export default logger;