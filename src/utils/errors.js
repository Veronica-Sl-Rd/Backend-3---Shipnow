import { ERROR_CODES } from "../constants/error.constants.js";

export default class CustomError extends Error {

    constructor(code = ERROR_CODES.INTERNAL_SERVER_ERROR) {
        super(code);
        this.code = code;
        
    }
}