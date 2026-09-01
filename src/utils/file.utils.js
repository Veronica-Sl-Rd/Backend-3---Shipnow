import fs from "fs/promises";
import logger from "./logger.js";

export async function deleteFile(filePath) {
    if (!filePath) return;
    try {
        await fs.unlink(filePath);
    } catch (error) {
        logger.error(
            `No fue posible eliminar el archivo ${filePath}: ${error.message}`
        );
    }
}