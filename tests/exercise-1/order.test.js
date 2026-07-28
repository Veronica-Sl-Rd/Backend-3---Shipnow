import { describe, test, expect } from '@jest/globals';
import OrdersService from '../../src/services/orders.service.js';
import * as paymentGateway from '../../src/utils/payment-gateway.js';
import * as notificationService from '../../src/utils/notification-service.js';

describe('OrdersService — El test que miente', () => {

    test.skip('debería crear un pedido y devolver status created', async () => {
        const fakeRepo = {
            create: async (data) => ({ _id: '123', ...data }),
            findById: async () => null,
            findAll: async () => []
        };

        const fakeUsersRepo = {
            findById: async () => ({ _id: 'user-id-123', firstName: 'Test' })
        };

        const service = new OrdersService(
            fakeRepo, fakeUsersRepo,
            paymentGateway, notificationService
        );

        const order = await service.create({
            customer: 'user-id-123',
            items: [{ name: 'Remera', quantity: 1, price: 500 }],
            deliveryAddress: 'Av. Test 123',
            paymentMethod: 'card'
        });

        expect(order.status).toBe('created');
        expect(order._id).toBe('123');
    });
});