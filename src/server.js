import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/index.js";
import logger from "./utils/logger.js";

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Conectado a MongoDB");
    app.listen(config.PORT, () => {
      logger.info(`Servidor corriendo en puerto ${config.PORT}`);
    });
  })
  .catch((error) => {
    logger.fatal(`Error crítico al conectar con MongoDB: ${error.message}`);
        process.exit(1);
  });

