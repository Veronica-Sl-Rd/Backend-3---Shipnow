import logger from "../utils/logger.js";

class LoggerController {

    testLogger(req, res) {

        logger.debug("Logger test - DEBUG");
        logger.http("Logger test - HTTP");
        logger.info("Logger test - INFO");
        logger.warning("Logger test - WARNING");
        logger.error("Logger test - ERROR");
        logger.fatal("Logger test - FATAL");

        res.json({
            status: "success",
            message: "Todos los niveles de logger fueron ejecutados"
        });
    }
}

export default new LoggerController();