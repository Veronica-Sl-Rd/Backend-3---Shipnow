import { describe, test, expect, jest } from '@jest/globals';
import OrdersService from '../../src/services/orders.service.js';
import { stubOrderRepository } from './stubs/stub-order-repo.js';

describe('Exercise 2 - Mocks Estratégicos', () => {

    test('debe crear un pedido cuando el pago es exitoso', async () => {

        // ---------- Arrange ----------

        const paymentGateway = {
            charge: jest.fn().mockResolvedValue({
                success: true,
                transactionId: 'tx-123'
            })
        };

        const notificationService = {
            sendNotification: jest.fn().mockResolvedValue({
                sent: true
            })
        };

        const usersRepository = {
            findById: jest.fn().mockResolvedValue({
                _id: 'user-1',
                firstName: 'Vero'
            })
        };

        const service = new OrdersService(
            stubOrderRepository,
            usersRepository,
            paymentGateway,
            notificationService
        );

        const orderData = {
            customer: 'user-1',
            items: [
                {
                    name: 'Remera',
                    quantity: 2,
                    price: 500
                }
            ],
            deliveryAddress: 'Av. Siempre Viva 742',
            paymentMethod: 'card'
        };

        // ---------- Act ----------

        const result = await service.create(orderData);

        // ---------- Assert ----------

        expect(paymentGateway.charge).toHaveBeenCalledTimes(1);

        expect(paymentGateway.charge)
            .toHaveBeenCalledWith(1000, 'card');

        expect(stubOrderRepository.create)
            .toHaveBeenCalledTimes(1);

        expect(result.status).toBe('created');
    });

    test('NO debe crear el pedido cuando el pago falla', async () => {

        // ---------- Arrange ----------

        const paymentGateway = {
            charge: jest.fn().mockResolvedValue({
                success: false
            })
        };

        const notificationService = {
            sendNotification: jest.fn()
        };

        const usersRepository = {
            findById: jest.fn().mockResolvedValue({
                _id: 'user-1'
            })
        };

        stubOrderRepository.create.mockClear();

        const service = new OrdersService(
            stubOrderRepository,
            usersRepository,
            paymentGateway,
            notificationService
        );

        // ---------- Act + Assert ----------

        await expect(
            service.create({
                customer: 'user-1',
                items: [
                    {
                        name: 'Remera',
                        quantity: 2,
                        price: 500
                    }
                ],
                deliveryAddress: 'Av. Siempre Viva 742'
            })
        ).rejects.toThrow('Pago rechazado');

        expect(paymentGateway.charge)
            .toHaveBeenCalledTimes(1);

        expect(stubOrderRepository.create)
            .not.toHaveBeenCalled();
    });

});