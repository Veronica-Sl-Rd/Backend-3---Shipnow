import { ERROR_CODES } from '../constants/error.constants.js';
import CustomError from '../utils/errors.js';
import logger from "../utils/logger.js"

export default class OrdersService {
    constructor(ordersRepository, usersRepository, paymentGateway, notificationService) {
        this.ordersRepository = ordersRepository;
        this.usersRepository = usersRepository;
        this.paymentGateway = paymentGateway;
        this.notificationService = notificationService;
    }

    async findAll(filter = {}) {
        return this.ordersRepository.findAll(filter);
    }

    async findById(id) {
        const order = await this.ordersRepository.findById(id);
        if (!order) {
            throw new CustomError(ERROR_CODES.ORDER_NOT_FOUND);
        }
        return order;
    }

    async create(orderData) {
        const customer = await this.usersRepository.findById(orderData.customer);
        if (!customer) {
            throw new CustomError(ERROR_CODES.CUSTOMER_NOT_FOUND);
        }
        if (!orderData.items || orderData.items.length === 0) {
            throw new CustomError(ERROR_CODES.INVALID_ORDER);
        }

        const total = orderData.items.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        const payment = await this.paymentGateway.charge(total, orderData.paymentMethod || 'card');
        if (!payment.success) {
            throw new CustomError(ERROR_CODES.PAYMENT_REJECTED);
        }

        const saved = await this.ordersRepository.create({ ...orderData, total, status: 'created' });
        logger.info(`Pedido creado correctamente: ${saved._id}`);
        try {
            await this.notificationService.sendNotification(
                saved.customer,
                `Tu pedido #${saved._id} fue confirmado`
            );
        } catch (e) {
        }
        return saved;
    }

    async update(id, orderData) {
        const updated = await this.ordersRepository.update(id, orderData);
        if (!updated) {
            throw new CustomError(ERROR_CODES.ORDER_NOT_FOUND);
        }
        return updated;
    }

    async delete(id) {
        const deleted = await this.ordersRepository.delete(id);
        if (!deleted) {
            throw new CustomError(ERROR_CODES.ORDER_NOT_FOUND);
        }
        return deleted;
    }

    async cancelOrder(id) {
        const order = await this.ordersRepository.findById(id);
        if (!order) {
            throw new CustomError(ERROR_CODES.ORDER_NOT_FOUND);
        }
        if (order.status === 'delivered') {
            throw new CustomError(ERROR_CODES.ORDER_ALREADY_DELIVERED);
        }
        return this.ordersRepository.update(id, { status: 'cancelled' });
    }
}