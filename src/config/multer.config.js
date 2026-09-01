import multer from "multer";
import path from "path";
import fs from "fs";
import {ALLOWED_FILE_TYPES, MAX_FILE_SIZE, UPLOAD_FOLDERS} from "../constants/file.constants.js";
import CustomError from "../utils/errors.js";
import { ERROR_CODES } from "../constants/error.constants.js";

Object.values(UPLOAD_FOLDERS).forEach((folder) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
});

function generateFilename(file) {
    const extension = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;

    return `${uniqueName}${extension}`;
}

function fileFilter(req, file, cb) {
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        return cb(new CustomError(ERROR_CODES.INVALID_FILE_TYPE));
    }

    cb(null, true);
}

function createStorage(destination) {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destination);
        },

        filename: (req, file, cb) => {
            cb(null, generateFilename(file));
        }
    });
}

function createUploader(destination) {
    return multer({
        storage: createStorage(destination),
        limits: {
            fileSize: MAX_FILE_SIZE
        },
        fileFilter
    });
}

export const uploadUserDocument = createUploader(
    UPLOAD_FOLDERS.DOCUMENTS
);

export const uploadDeliveryProof = createUploader(
    UPLOAD_FOLDERS.DELIVERY_PROOFS
);