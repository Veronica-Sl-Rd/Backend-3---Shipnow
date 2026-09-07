import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js' ;
import logger from './utils/logger.js';
import { swaggerSpec } from './docs/swagger.config.js';
import swaggerUi from "swagger-ui-express"
import { multerErrorHandler } from "./middlewares/multerErrorHandler.js";
import config from "./config/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', apiRouter);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        environment: config.NODE_ENV,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.use((req, res) => {
    logger.warning(`Ruta inexistente: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
});

app.use(multerErrorHandler);
app.use(errorHandler);

export default app;
