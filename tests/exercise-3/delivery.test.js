import { describe, test, expect, jest } from '@jest/globals';
import DeliveriesService from '../../src/services/deliveries.service.js';
import { weatherFixtures } from './fixtures/delivery.fixture.js';
import { availableDriver } from './fixtures/driver-fixture.js';

describe('Exercise 3 - Taller de Fixtures', () => {

    test('Tormenta: entrega cancelada y no busca repartidor', async () => {

        const weatherApi = {
            getWeather: jest.fn()
                .mockResolvedValue(weatherFixtures.storm)
        };

        const driverRepository = {
            findAvailableDriverByCity: jest.fn()
        };

        const service = new DeliveriesService(
            {},
            {},
            {},
            weatherApi,
            driverRepository
        );

        const result = await service.checkDelivery(
            "Buenos Aires",
            "order-1"
        );

        expect(result.deliverable).toBe(false);

        expect(driverRepository.findAvailableDriverByCity)
            .not.toHaveBeenCalled();
    });


    test('Nieve: entrega cancelada', async () => {

        const weatherApi = {
            getWeather: jest.fn()
                .mockResolvedValue(weatherFixtures.snow)
        };

        const service = new DeliveriesService(
            {},
            {},
            {},
            weatherApi,
            {}
        );

        const result = await service.checkDelivery(
            "Bariloche",
            "order-2"
        );

        expect(result.deliverable).toBe(false);
    });


    test('Sol: entrega normal con 20 minutos', async () => {

        const weatherApi = {
            getWeather: jest.fn()
                .mockResolvedValue(weatherFixtures.sunny)
        };

        const driverRepository = {
            findAvailableDriverByCity: jest.fn()
                .mockResolvedValue(availableDriver)
        };

        const service = new DeliveriesService(
            {},
            {},
            {},
            weatherApi,
            driverRepository
        );

        const result = await service.checkDelivery(
            "Buenos Aires",
            "order-3"
        );

        expect(result.deliverable).toBe(true);

        expect(result.estimatedTime).toBe(20);

    });


    test('Lluvia: entrega con demora de 45 minutos', async () => {

        const weatherApi = {
            getWeather: jest.fn()
                .mockResolvedValue(weatherFixtures.rain)
        };

        const driverRepository = {
            findAvailableDriverByCity: jest.fn()
                .mockResolvedValue(availableDriver)
        };

        const service = new DeliveriesService(
            {},
            {},
            {},
            weatherApi,
            driverRepository
        );

        const result = await service.checkDelivery(
            "Buenos Aires",
            "order-4"
        );

        expect(result.estimatedTime).toBe(45);

    });


    test('Sin repartidores: entrega cancelada', async () => {

        const weatherApi = {
            getWeather: jest.fn()
                .mockResolvedValue(weatherFixtures.sunny)
        };

        const driverRepository = {
            findAvailableDriverByCity: jest.fn()
                .mockResolvedValue(null)
        };

        const service = new DeliveriesService(
            {},
            {},
            {},
            weatherApi,
            driverRepository
        );

        const result = await service.checkDelivery(
            "Buenos Aires",
            "order-5"
        );

        expect(result.deliverable).toBe(false);

        expect(result.reason).toBe("No hay repartidores disponibles en esta zona"
        );
    });

});