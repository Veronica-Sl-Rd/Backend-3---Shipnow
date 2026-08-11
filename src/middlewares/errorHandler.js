import { ERROR_CODES, ERROR_DICTIONARY } from "../constants/error.constants.js";
import logger from "../utils/logger.js"

export function errorHandler(err, req, res, next) {

    const error =
        ERROR_DICTIONARY[err.code] ??
        ERROR_DICTIONARY[ERROR_CODES.INTERNAL_SERVER_ERROR];

    if (err.code) {
        logger.warning(
            `${err.code} - ${req.method} ${req.originalUrl}`
        );
    } else {
        logger.error(
            `Error inesperado en ${req.method} ${req.originalUrl}: ${err.message}`
        );
    }

    res.status(error.statusCode).json({
        status: "error",
        error: err.code || ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: error.message
    });

}