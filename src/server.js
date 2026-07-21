import mongoose from "mongoose";
import app from "./app.js";
import { env } from "./config/index.js";

mongoose.connect(env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(env.PORT, () => {
      console.log(`Servidor corriendo en puerto ${env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con MongoDB:', error.message);
    process.exit(1);
  });

