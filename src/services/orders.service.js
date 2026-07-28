import AppError from '../utils/errors.js';

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
            throw new AppError('Pedido no encontrado', 404);
        }
        return order;
    }

    async create(orderData) {
        const customer = await this.usersRepository.findById(orderData.customer);
        if (!customer) {
            throw new AppError('El cliente especificado no existe', 400);
        }

        if (!orderData.items || orderData.items.length === 0) {
            throw new AppError('El pedido debe tener al menos un item', 400);
        }

        const total = orderData.items.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        const payment = await this.paymentGateway.charge(total, orderData.paymentMethod || 'card');

        if (!payment.success) {
            throw new AppError('Pago rechazado', 402);
        }

        const saved = await this.ordersRepository.create({ ...orderData, total, status: 'created' });

        try {
            await this.notificationService.sendNotification(
                saved.customer,
                `Tu pedido #${saved._id} fue confirmado`
            );
        } catch (e) {
            // La notificación no bloquea la creación del pedido
        }

        return saved;
    }

    async update(id, orderData) {
        const updated = await this.ordersRepository.update(id, orderData);
        if (!updated) {
            throw new AppError('Pedido no encontrado', 404);
        }
        return updated;
    }

    async delete(id) {
        const deleted = await this.ordersRepository.delete(id);
        if (!deleted) {
            throw new AppError('Pedido no encontrado', 404);
        }
        return deleted;
    }

    async cancelOrder(id) {
        const order = await this.ordersRepository.findById(id);
        if (!order) {
            throw new AppError('Pedido no encontrado', 404);
        }
        if (order.status === 'delivered') {
            throw new AppError('No se puede cancelar un pedido ya entregado', 400);
        }
        return this.ordersRepository.update(id, { status: 'cancelled' });
    }
}