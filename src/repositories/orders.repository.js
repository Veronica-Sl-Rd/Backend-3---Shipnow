import Order from '../models/order.model.js';

class OrdersRepository {
    async findAll(filter = {}, page, limit) {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate('customer', 'firstName lastName email')
                .populate('delivery')
                .skip(skip)
                .limit(limit),
            Order.countDocuments(filter)
        ]);
        return {orders, total};
    }

    async findById(id) {
        return Order.findById(id)
            .populate('customer', 'firstName lastName email')
            .populate('delivery');
    }

    async create(orderData) {
        return Order.create(orderData);
    }

    async update(id, orderData) {
        return Order.findByIdAndUpdate(id, orderData, { new: true });
    }

    async delete(id) {
        return Order.findByIdAndDelete(id);
    }
}

export default new OrdersRepository();