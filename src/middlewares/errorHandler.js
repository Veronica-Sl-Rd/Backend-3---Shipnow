import { ERROR_CODES, ERROR_DICTIONARY } from "../constants/error.constants.js";

export function errorHandler(err, req, res, next) {

    const error =
        ERROR_DICTIONARY[err.code] ??
        ERROR_DICTIONARY[ERROR_CODES.INTERNAL_SERVER_ERROR];

    res.status(error.statusCode).json({
        status: "error",
        error: err.code || ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: error.message
    });

}