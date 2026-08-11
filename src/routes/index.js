import { Router } from 'express';
import usersRouter from './users.routes.js';
import ordersRouter from './orders.routes.js';
import deliveriesRouter from './deliveries.routes.js';
import mocksRouter from './mocks.routes.js';
import loggerRouter from "./logger.routes.js"

const router = Router();

router.use('/users', usersRouter);
router.use('/orders', ordersRouter);
router.use('/deliveries', deliveriesRouter);
router.use('/mocks', mocksRouter);
router.use("/logger", loggerRouter);

export default router;