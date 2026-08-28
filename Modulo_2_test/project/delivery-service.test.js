import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import DeliveriesService from '../../src/services/deliveries.service.js';
import { weatherFixtures } from '../exercise-3/fixtures/delivery.fixture.js';
import { availableDriver, unavailableDriver } from '../exercise-3/fixtures/driver-fixture.js';
import { data } from '../tipos-de-mocks/data-fixture.js';
import { USER_ROLES, DELIVERY_STATUS, DELIVERY_PRIORITY } from '../../src/constants/index.js'

const { storm, sunny, rain, snow } = weatherFixtures;

describe('DeliveriesService — Mock (jest.fn())', () => {

    test('debería verificar el clima y asignar repartidor', async () => {

        // --- ARRANGE ---
        const weatherMock = {
            getWeather: jest.fn().mockResolvedValue(sunny)
        };

        const driverRepoMock = {
            findAvailableDriverByCity: jest.fn().mockResolvedValue(availableDriver)
        };

        const service = new DeliveriesService({}, {}, {}, weatherMock, driverRepoMock);

        // --- ACT ---
        const result = await service.checkDelivery('Buenos Aires', 'order-1');

        // --- ASSERT (Resultado) ---
        expect(result.deliverable).toBe(true);
        expect(result.driver.name).toBe('Carlos');

        // --- ASSERT (Comportamiento) ---
        expect(weatherMock.getWeather).toHaveBeenCalledTimes(1);
        expect(weatherMock.getWeather).toHaveBeenCalledWith('Buenos Aires');
        expect(driverRepoMock.findAvailableDriverByCity).toHaveBeenCalledWith('Buenos Aires');
    });


    test('debería abortar si hay tormenta sin buscar repartidor', async () => {

        // --- ARRANGE ---
        const weatherMock = {
            getWeather: jest.fn().mockResolvedValue(storm)
        };

        const driverRepoMock = {
            findAvailableDriverByCity: jest.fn()
        };

        const service = new DeliveriesService({}, {}, {}, weatherMock, driverRepoMock);

        // --- ACT ---
        const result = await service.checkDelivery('Buenos Aires', 'order-2');

        // --- ASSERT ---
        expect(result.deliverable).toBe(false);
        expect(weatherMock.getWeather).toHaveBeenCalled();
        expect(driverRepoMock.findAvailableDriverByCity).not.toHaveBeenCalled();
    });

    test('debería cancelar si no hay repartidores disponibles', async () => {

        // --- ARRANGE ---
        const weatherMock = {
            getWeather: jest.fn().mockResolvedValue(sunny)
        };

        const driverRepoMock = {
            findAvailableDriverByCity: jest.fn().mockResolvedValue(null)
        };

        const service = new DeliveriesService({}, {}, {}, weatherMock, driverRepoMock);

        // --- ACT ---
        const result = await service.checkDelivery('Buenos Aires', 'order-3');

        // --- ASSERT ---
        expect(result.deliverable).toBe(false);
        expect(result.reason).toBe('No hay repartidores disponibles en esta zona');
        // Se buscó repartidor pero no se encontró
        expect(driverRepoMock.findAvailableDriverByCity).toHaveBeenCalledTimes(1);
    });

});

// 2. STUB — Valores predecibles

describe('DeliveriesService — Stub', () => {

    const stubDeliveriesRepo = {
        findById: async (id) => {
            if (id === 'delivery-001') {
                return {
                    _id: 'delivery-001',
                    order: { _id: 'order-001', total: 3000 },
                    driver: { _id: 'driver-001', firstName: 'Carlos' },
                    status: DELIVERY_STATUS.ASSIGNED,
                    priority: DELIVERY_PRIORITY.NORMAL
                };
            }
            return null;
        },
        findAll: async () => [
            { _id: 'delivery-001', status: DELIVERY_STATUS.ASSIGNED },
            { _id: 'delivery-002', status: DELIVERY_STATUS.DELIVERED }
        ]
    };

    const service = new DeliveriesService(stubDeliveriesRepo, {}, {}, {}, {});

    test('debería encontrar una entrega existente', async () => {

        // --- ACT ---
        const delivery = await service.findById('delivery-001');

        // --- ASSERT ---
        expect(delivery).not.toBeNull();
        expect(delivery._id).toBe('delivery-001');
        expect(delivery.status).toBe(DELIVERY_STATUS.ASSIGNED);
    });

    test('debería lanzar 404 si la entrega no existe', async () => {

        // --- ACT & ASSERT ---
        await expect(service.findById('nonexistent')).rejects.toThrow('Entrega no encontrada');
    });

    test('debería listar todas las entregas', async () => {

        // --- ACT ---
        const deliveries = await service.findAll();

        // --- ASSERT ---
        expect(deliveries).toHaveLength(2);
    });
});

// 3. FAKE — Implementación in-memory funcional

class DeliveryFakeRepository {
    constructor() {
        this.deliveries = [];
        this.counter = 1;
    }

    async findAll() { return this.deliveries; }

    async findById(id) {
        return this.deliveries.find(d => d._id === id) || null;
    }

    async create(data) {
        const delivery = {
            _id: `delivery-${String(this.counter++).padStart(3, '0')}`,
            status: DELIVERY_STATUS.PENDING,
            ...data
        };
        this.deliveries.push(delivery);
        return delivery;
    }

    async update(id, data) {
        const index = this.deliveries.findIndex(d => d._id === id);
        if (index === -1) return null;
        this.deliveries[index] = { ...this.deliveries[index], ...data };
        return this.deliveries[index];
    }

    async delete(id) {
        const index = this.deliveries.findIndex(d => d._id === id);
        if (index === -1) return null;
        const [deleted] = this.deliveries.splice(index, 1);
        return deleted;
    }
}

describe('DeliveriesService — Fake', () => {

    let fakeRepo;
    let service;

    beforeEach(() => {
        fakeRepo = new DeliveryFakeRepository();
        const fakeOrdersRepo = {
            findById: async (id) => ({ _id: id, total: 3000 })
        };
        const fakeUsersRepo = {
            findById: async (id) => ({ _id: id, firstName: 'Test Driver', role: USER_ROLES.DRIVER })
        };
        service = new DeliveriesService(fakeRepo, fakeOrdersRepo, fakeUsersRepo, {}, {});
    });

    test('crear, actualizar y verificar entrega (flujo completo)', async () => {

        // --- ACT (1): Crear entrega ---
        const created = await service.create({
            order: 'order-001',
            driver: 'driver-001',
            priority: DELIVERY_PRIORITY.NORMAL
        });

        // --- ASSERT: Entrega creada ---
        expect(created._id).toBeDefined();
        expect(created.status).toBe(DELIVERY_STATUS.PENDING);

        // --- ACT (2): Actualizar estado ---
        const updated = await service.update(created._id, {
            status: DELIVERY_STATUS.IN_TRANSIT,
            assignedAt: new Date()
        });

        // --- ASSERT: Estado actualizado ---
        expect(updated.status).toBe(DELIVERY_STATUS.IN_TRANSIT);
        expect(updated.assignedAt).toBeDefined();

        // --- ACT (3): Verificar en el repo ---
        const found = await service.findById(created._id);
        expect(found.status).toBe(DELIVERY_STATUS.IN_TRANSIT);
    });

    test('debería crear múltiples entregas y listarlas', async () => {

        // --- ACT ---
        await service.create({ order: 'order-001', driver: 'driver-001' });
        await service.create({ order: 'order-002', driver: 'driver-002' });
        await service.create({ order: 'order-003', driver: 'driver-001' });

        // --- ASSERT ---
        const all = await service.findAll();
        expect(all).toHaveLength(3);
    });

    test('debería eliminar una entrega', async () => {

        // --- ACT ---
        const created = await service.create({
            order: 'order-001',
            driver: 'driver-001'
        });

        const deleted = await service.delete(created._id);

        // --- ASSERT ---
        expect(deleted._id).toBe(created._id);
        const all = await service.findAll();
        expect(all).toHaveLength(0);
    });

});

// 4. DATA FIXTURE — Datos predefinidos reutilizables

describe('DeliveriesService — Data Fixtures', () => {

    const stubRepo = {
        create: async (data) => ({ _id: 'delivery-fixture', ...data }),
        findById: async (id) => {
            if (id === 'delivery-fixture') {
                return { _id: 'delivery-fixture', status: DELIVERY_STATUS.PENDING, order: 'order-001' };
            }
            return null;
        }
    };

    const fakeOrdersRepo = {
        findById: async (id) => ({ _id: id, total: 3000 })
    };

    const fakeUsersRepo = {
        findById: async (id) => ({ _id: id, firstName: 'Driver Fixture', role: USER_ROLES.DRIVER })
    };

    const service = new DeliveriesService(
        stubRepo, fakeOrdersRepo, fakeUsersRepo, {}, {}
    );

    test('debería crear entrega con datos del fixture', async () => {

        // --- ARRANGE ---
        const deliveryData = {
            order: data.order.customer,
            driver: data.driver._id,
            priority: data.order.priority
        };

        // --- ACT ---
        const delivery = await service.create(deliveryData);

        // --- ASSERT ---
        expect(delivery._id).toBe('delivery-fixture');
    });

    test('debería crear entrega con prioridad alta', async () => {

        // --- ARRANGE ---
        const urgentDelivery = {
            order: 'order-001',
            driver: 'driver-001',
            priority: DELIVERY_PRIORITY.HIGH
        };

        // --- ACT ---
        const delivery = await service.create(urgentDelivery);

        // --- ASSERT ---
        expect(delivery.priority).toBe(DELIVERY_PRIORITY.HIGH);
    });

    test('debería rechazar entrega con pedido inexistente', async () => {

        // --- ARRANGE ---
        const noOrderRepo = {
            findById: async () => null
        };
        const serviceNoOrder = new DeliveriesService(
            stubRepo, noOrderRepo, fakeUsersRepo, {}, {}
        );

        // --- ACT & ASSERT ---
        await expect(
            serviceNoOrder.create({ order: 'nonexistent', driver: 'driver-001' })
        ).rejects.toThrow('El pedido especificado no existe');
    });

});