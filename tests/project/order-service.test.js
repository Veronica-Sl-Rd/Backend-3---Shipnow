import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import OrdersService from '../../src/services/orders.service.js';
import { data } from '../tipos-de-mocks/data-fixture.js';
import { notificationStub } from '../tipos-de-mocks/Stub.js';
import OrderFakeRepository from '../tipos-de-mocks/Fakes.js';
import { ORDER_STATUS } from '../../src/constants/index.js';

describe('OrdersService — Mock (jest.fn())', () => {

    test('debería cobrar el pago y crear la orden', async () => {

        // --- ARRANGE ---
        // Mock del paymentGateway: simula cobro exitoso
        const paymentMock = {
            charge: jest.fn().mockResolvedValue({
                success: true,
                transactionId: 'txn-001',
                amount: 3800
            })
        };

        // Mock del repositorio: verifica que create se llama
        const ordersRepoMock = {
            create: jest.fn().mockResolvedValue({
                _id: 'order-001',
                customer: 'user-123',
                items: data.order.items,
                total: 3800,
                status: ORDER_STATUS.CREATED
            })
        };

        // Stub del repositorio de usuarios
        const usersRepoMock = {
            findById: jest.fn().mockResolvedValue({
                _id: 'user-123',
                firstName: 'Camila'
            })
        };

        const service = new OrdersService(
            ordersRepoMock, usersRepoMock, paymentMock, notificationStub
        );

        // --- ACT ---
        const order = await service.create(data.order);

        // --- ASSERT (Resultado) ---
        expect(order._id).toBe('order-001');
        expect(order.status).toBe(ORDER_STATUS.CREATED);

        // --- ASSERT (Comportamiento) ---
        // Verificamos que el pago se procesó con el monto correcto
        expect(paymentMock.charge).toHaveBeenCalledTimes(1);
        expect(paymentMock.charge).toHaveBeenCalledWith(3800, 'card');

        // Verificamos que se creó la orden en el repo
        expect(ordersRepoMock.create).toHaveBeenCalledTimes(1);

        // Verificamos que se buscó el usuario
        expect(usersRepoMock.findById).toHaveBeenCalledWith('user-id-123');
    });


    test('debería lanzar 402 si el pago falla', async () => {

        // --- ARRANGE ---
        const paymentMock = {
            charge: jest.fn().mockResolvedValue({
                success: false,
                error: 'Fondos insuficientes'
            })
        };

        const ordersRepoMock = {
            create: jest.fn()
        };

        const usersRepoMock = {
            findById: jest.fn().mockResolvedValue({ _id: 'user-123' })
        };

        const service = new OrdersService(
            ordersRepoMock, usersRepoMock, paymentMock, notificationStub
        );

        // --- ACT & ASSERT ---
        await expect(
            service.create(data.order)
        ).rejects.toThrow('Pago rechazado');

        // Verificamos que NUNCA se creó la orden
        expect(ordersRepoMock.create).not.toHaveBeenCalled();
    });

    test('debería cancelar una orden pendiente', async () => {

        // --- ARRANGE ---
        const ordersRepoMock = {
            findById: jest.fn().mockResolvedValue({
                _id: 'order-001',
                status: ORDER_STATUS.CREATED,
                customer: 'user-123'
            }),
            update: jest.fn().mockResolvedValue({
                _id: 'order-001',
                status: ORDER_STATUS.CANCELLED
            })
        };

        const service = new OrdersService(ordersRepoMock, {}, {}, notificationStub);

        // --- ACT ---
        const result = await service.cancelOrder('order-001');

        // --- ASSERT ---
        expect(result.status).toBe(ORDER_STATUS.CANCELLED);
        expect(ordersRepoMock.update).toHaveBeenCalledWith('order-001', { status: ORDER_STATUS.CANCELLED });
    });

    test('debería lanzar 400 al cancelar orden entregada', async () => {

        // --- ARRANGE ---
        const ordersRepoMock = {
            findById: jest.fn().mockResolvedValue({
                _id: 'order-001',
                status: ORDER_STATUS.DELIVERED
            }),
            update: jest.fn()
        };

        const service = new OrdersService(ordersRepoMock, {}, {}, notificationStub);

        // --- ACT & ASSERT ---
        await expect(service.cancelOrder('order-001')).rejects.toThrow(
            'No se puede cancelar un pedido ya entregado'
        );

        expect(ordersRepoMock.update).not.toHaveBeenCalled();
    });

});

//STUB — Valores predecibles

describe('OrdersService — Stub', () => {

    // Stub del repositorio: datos hardcodeados
    const stubRepo = {
        findById: async (id) => {
            if (id === 'order-001') {
                return {
                    _id: 'order-001',
                    customer: 'user-123',
                    items: [{ name: 'Paquete', quantity: 2, price: 1500 }],
                    total: 3000,
                    status: ORDER_STATUS.CREATED,
                    deliveryAddress: 'Av. Test 123'
                };
            }
            return null;
        },
        findAll: async () => [
            { _id: 'order-001', total: 3000, status: ORDER_STATUS.CREATED },
            { _id: 'order-002', total: 1500, status: ORDER_STATUS.DELIVERED }
        ]
    };

    const service = new OrdersService(stubRepo, {}, {}, notificationStub);

    test('debería encontrar una orden existente', async () => {

        // --- ACT ---
        const order = await service.findById('order-001');

        // --- ASSERT ---
        expect(order).not.toBeNull();
        expect(order._id).toBe('order-001');
        expect(order.total).toBe(3000);
        expect(order.status).toBe(ORDER_STATUS.CREATED);
    });


    test('debería lanzar 404 si la orden no existe', async () => {

        // --- ACT & ASSERT ---
        await expect(service.findById('nonexistent')).rejects.toThrow('Pedido no encontrado');
    });


    test('debería listar todas las órdenes', async () => {

        // --- ACT ---
        const orders = await service.findAll();

        // --- ASSERT ---
        expect(orders).toHaveLength(2);
        expect(orders[0]._id).toBe('order-001');
    });
});

// 3. FAKE — Implementación in-memory funcional

describe('OrdersService — Fake', () => {

    let fakeRepo;
    let service;

    beforeEach(() => {
        fakeRepo = new OrderFakeRepository();
        const fakeUsersRepo = {
            findById: async (id) => ({ _id: id, firstName: 'Test' })
        };
        const fakePayment = {
            charge: async () => ({ success: true, transactionId: 'txn-fake' })
        };
        service = new OrdersService(fakeRepo, fakeUsersRepo, fakePayment, notificationStub);
    });


    test('crear, encontrar y cancelar orden (flujo completo)', async () => {

        // --- ACT (1): Crear orden ---
        const created = await service.create({
            customer: 'user-123',
            items: [{ name: 'Remera', quantity: 2, price: 500 }],
            deliveryAddress: 'Calle Fake 123',
            paymentMethod: 'card'
        });

        // --- ASSERT: Orden creada ---
        expect(created._id).toBeDefined();
        expect(created.status).toBe(ORDER_STATUS.CREATED);

        // --- ACT (2): Encontrar la orden ---
        const found = await service.findById(created._id);
        expect(found._id).toBe(created._id);

        // --- ACT (3): Cancelar la orden ---
        const cancelled = await service.cancelOrder(created._id);
        expect(cancelled.status).toBe(ORDER_STATUS.CANCELLED);
    });

    test('debería listar todas las órdenes creadas', async () => {

        // --- ACT: Crear múltiples órdenes ---
        await service.create({
            customer: 'user-123',
            items: [{ name: 'Paquete A', quantity: 1, price: 1000 }],
            deliveryAddress: 'Dirección 1'
        });
        await service.create({
            customer: 'user-456',
            items: [{ name: 'Paquete B', quantity: 3, price: 500 }],
            deliveryAddress: 'Dirección 2'
        });

        // --- ASSERT ---
        const all = await service.findAll();
        expect(all).toHaveLength(2);
    });
});

// 4. DATA FIXTURE — Datos predefinidos reutilizables

describe('OrdersService — Data Fixtures', () => {

    const stubRepo = {
        create: async (data) => ({ _id: 'order-fixture', ...data }),
        findById: async (id) => {
            if (id === 'order-fixture') {
                return { _id: 'order-fixture', status: ORDER_STATUS.CREATED, customer: 'user-123' };
            }
            return null;
        }
    };

    const fakeUsersRepo = {
        findById: async (id) => ({ _id: id, firstName: 'Fixture User' })
    };

    const fakePayment = {
        charge: async () => ({ success: true, transactionId: 'txn-fixture' })
    };

    const service = new OrdersService(stubRepo, fakeUsersRepo, fakePayment, notificationStub);

    test('debería crear orden con datos válidos del fixture', async () => {

        // --- ARRANGE ---
        // Importamos datos del fixture ( datos predefinidos )
        const orderData = data.order;

        // --- ACT ---
        const order = await service.create(orderData);

        // --- ASSERT ---
        expect(order).toBeDefined();
        expect(order._id).toBe('order-fixture');
    });


    test('debería crear orden con prioridad alta', async () => {

        // --- ARRANGE ---
        const urgentOrder = {
            ...data.order,
            priority: 'high'
        };

        // --- ACT ---
        const order = await service.create(urgentOrder);

        // --- ASSERT ---
        expect(order.priority).toBe('high');
    });


    test('debería crear orden con múltiples items', async () => {

        // --- ARRANGE ---
        const multiItemOrder = {
            ...data.order,
            items: [
                { name: 'Producto A', quantity: 2, price: 1000 },
                { name: 'Producto B', quantity: 1, price: 500 },
                { name: 'Producto C', quantity: 3, price: 200 }
            ]
        };

        // --- ACT ---
        const order = await service.create(multiItemOrder);

        // --- ASSERT ---
        expect(order.items).toHaveLength(3);
    });


    test('debería rechazar orden sin items', async () => {

        // --- ARRANGE ---
        const emptyOrder = {
            ...data.order,
            items: []
        };

        // --- ACT & ASSERT ---
        await expect(service.create(emptyOrder)).rejects.toThrow(
            'El pedido debe tener al menos un item'
        );
    });


    test('debería rechazar orden con cliente inexistente', async () => {

        // --- ARRANGE ---
        const noCustomerRepo = {
            findById: async () => null
        };
        const serviceNoCustomer = new OrdersService(
            stubRepo, noCustomerRepo, fakePayment, notificationStub
        );

        // --- ACT & ASSERT ---
        await expect(
            serviceNoCustomer.create(data.order)
        ).rejects.toThrow('El cliente especificado no existe');
    });

});