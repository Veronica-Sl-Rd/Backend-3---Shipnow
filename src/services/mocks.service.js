import mocksRepository from "../repositories/mocks.repository.js";
import {generateMockUser, generateMockDriver} from "../mocks/users.mock.js";
import { generateMockOrder } from "../mocks/orders.mock.js";
import { generateMockDelivery } from "../mocks/deliveries.mock.js";

class MocksService {

    generateUsers(quantity = 50) {
        const users = [];

        for (let i = 0; i < quantity; i++) {
            users.push(generateMockUser(i));
        }

        return users;
    }

    generateDrivers(quantity = 50) {
        const drivers = [];

        for (let i = 0; i < quantity; i++) {
            drivers.push(generateMockDriver(i));
        }

        return drivers;
    }

    generateOrders(customers) {
        return customers.map(customer =>
            generateMockOrder(customer._id)
        );
    }

    generateDeliveries(orders, drivers) {
        return orders.map((order, index) =>
            generateMockDelivery(
                order._id,
                drivers[index % drivers.length]._id
            )
        );
    }

    async getMockUsers(quantity = 50) {
    return {
        customers: this.generateUsers(quantity),
        drivers: this.generateDrivers(quantity)
    };
    }

    async getMockOrders(quantity = 50) {

        const customers = this.generateUsers(quantity);

        const customersWithIds = customers.map((customer, index) => ({
            ...customer,
            _id: `mock-user-${index}`
        }));

        return this.generateOrders(customersWithIds);
    }

    async generateData(quantity = 50) {

        const customers = this.generateUsers(quantity);
        const drivers = this.generateDrivers(quantity);

        const savedCustomers = await mocksRepository.insertUsers(customers);
        const savedDrivers = await mocksRepository.insertUsers(drivers);

        const orders = this.generateOrders(savedCustomers);
        const savedOrders = await mocksRepository.insertOrders(orders);

        const deliveries = this.generateDeliveries(savedOrders, savedDrivers);

        const savedDeliveries = await mocksRepository.insertDeliveries(deliveries);

        return {
            users: savedCustomers.length,
            drivers: savedDrivers.length,
            orders: savedOrders.length,
            deliveries: savedDeliveries.length
        };
    }
}

export default new MocksService();