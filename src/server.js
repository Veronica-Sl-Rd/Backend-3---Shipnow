import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/index.js";

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(config.PORT, () => {
      console.log(`Servidor corriendo en puerto ${config.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con MongoDB:', error.message);
    process.exit(1);
  });

