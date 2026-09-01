import multer from "multer";
import CustomError from "../utils/errors.js";
import { ERROR_CODES } from "../constants/error.constants.js";

export function multerErrorHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return next(
                new CustomError(ERROR_CODES.FILE_TOO_LARGE)
            );
        }

        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return next(
                new CustomError(ERROR_CODES.INVALID_FILE_FIELD)
            );
        }

        return next(
            new CustomError(ERROR_CODES.FILE_UPLOAD_ERROR)
        );
    }

    next(err);
}