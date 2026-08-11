import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js' ;
import logger from './utils/logger.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
    logger.warning(`Ruta inexistente: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
});

app.use(errorHandler);

export default app;
