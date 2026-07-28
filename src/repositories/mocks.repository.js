import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Delivery from "../models/delivery.model.js";

class MocksRepository {

    async insertUsers(users) {
        return await User.insertMany(users);
    }

    async insertOrders(orders) {
        return await Order.insertMany(orders);
    }

    async insertDeliveries(deliveries) {
        return await Delivery.insertMany(deliveries);
    }
}

export default new MocksRepository();