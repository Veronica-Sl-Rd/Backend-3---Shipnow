import ordersRepo from '../repositories/orders.repository.js';
import usersRepo from '../repositories/users.repository.js';
import { charge } from '../utils/payment-gateway.js';
import { sendNotification } from '../utils/notification-service.js';
import OrdersService from '../services/orders.service.js';
import config from '../config/index.js';

const paymentGateway =
    config.NODE_ENV === 'test'
        ? {
            charge: async (amount) => ({
                success: true,
                transactionId: 'test-txn',
                amount
            })
        }
        : { charge };

const notificationService =
    config.NODE_ENV === 'test'
        ? {
            sendNotification: async () => true
        }
        : { sendNotification };

const ordersService = new OrdersService(ordersRepo, usersRepo, paymentGateway, notificationService);

class OrdersController {
    async findAll(req, res, next) {
        try {
            const orders = await ordersService.findAll();
            res.json({ status: 'success', payload: orders });
        } catch (error) {
            next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const order = await ordersService.findById(req.params.id);
            res.json({ status: 'success', payload: order });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const order = await ordersService.create(req.body);
            res.status(201).json({ status: 'success', payload: order });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const updated = await ordersService.update(req.params.id, req.body);
            res.json({ status: 'success', payload: updated });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await ordersService.delete(req.params.id);
            res.json({ status: 'success', message: 'Pedido eliminado' });
        } catch (error) {
            next(error);
        }
    }

    async cancelOrder(req, res, next) {
        try {
            const order = await ordersService.cancelOrder(req.params.id);
            res.json({ status: 'success', payload: order });
        } catch (error) {
            next(error);
        }
    }
}

export default new OrdersController();