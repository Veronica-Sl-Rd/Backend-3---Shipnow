export default class OrderFakeRepository {
    constructor() {
        this.orders = [];
        this.counter = 1;
    }

    async findAll() {
        return this.orders;
    }

    async findById(id) {
        return this.orders.find(o => o._id === id) || null;
    }

    async create(orderData) {
        const order = {
            _id: `order-${String(this.counter++).padStart(3, '0')}`,
            ...orderData
        };
        this.orders.push(order);
        return order;
    }

    async update(id, orderData) {
        const index = this.orders.findIndex(o => o._id === id);
        if (index === -1) return null;
        this.orders[index] = { ...this.orders[index], ...orderData };
        return this.orders[index];
    }

    async delete(id) {
        const index = this.orders.findIndex(o => o._id === id);
        if (index === -1) return null;
        const [deleted] = this.orders.splice(index, 1);
        return deleted;
    }
}