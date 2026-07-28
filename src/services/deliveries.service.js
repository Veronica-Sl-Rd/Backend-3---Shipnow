import AppError from '../utils/errors.js';

export default class DeliveriesService {
    constructor(deliveriesRepository, ordersRepository, usersRepository, weatherApi, driverRepository) {
        this.deliveriesRepository = deliveriesRepository;
        this.ordersRepository = ordersRepository;
        this.usersRepository = usersRepository;
        this.weatherApi = weatherApi;
        this.driverRepository = driverRepository;
    }

    async findAll(filter = {}) {
        return this.deliveriesRepository.findAll(filter);
    }

    async findById(id) {
        const delivery = await this.deliveriesRepository.findById(id);
        if (!delivery) {
            throw new AppError('Entrega no encontrada', 404);
        }
        return delivery;
    }

    async create(deliveryData) {
        const order = await this.ordersRepository.findById(deliveryData.order);
        if (!order) {
            throw new AppError('El pedido especificado no existe', 400);
        }

        if (deliveryData.driver) {
            const driver = await this.usersRepository.findById(deliveryData.driver);
            if (!driver) {
                throw new AppError('El repartidor especificado no existe', 400);
            }
        }

        return this.deliveriesRepository.create(deliveryData);
    }

    async checkDelivery(city, orderId) {
        const weather = await this.weatherApi.getWeather(city);

        if (weather.condition === 'storm' || weather.condition === 'snow') {
            return {
                orderId,
                deliverable: false,
                reason: `Clima peligroso: ${weather.condition}`,
                weather
            };
        }

        const driver = await this.driverRepository.findAvailableDriverByCity(city);

        if (!driver) {
            return {
                orderId,
                deliverable: false,
                reason: 'No hay repartidores disponibles en esta zona',
                weather
            };
        }

        return {
            orderId,
            deliverable: true,
            driver: { id: driver._id, name: driver.firstName },
            estimatedTime: weather.condition === 'rain' ? 45 : 20,
            weather
        };
    }

    async update(id, deliveryData) {
        const updated = await this.deliveriesRepository.update(id, deliveryData);
        if (!updated) {
            throw new AppError('Entrega no encontrada', 404);
        }
        return updated;
    }

    async delete(id) {
        const deleted = await this.deliveriesRepository.delete(id);
        if (!deleted) {
            throw new AppError('Entrega no encontrada', 404);
        }
        return deleted;
    }
}