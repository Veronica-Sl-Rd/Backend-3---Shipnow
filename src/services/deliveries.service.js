import { ERROR_CODES } from '../constants/error.constants.js';
import CustomError from '../utils/errors.js';
import { deleteFile } from "../utils/file.utils.js";
import logger from "../utils/logger.js";

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
            throw new CustomError(ERROR_CODES.DELIVERY_NOT_FOUND);
        }
        return delivery;
    }

    async create(deliveryData) {
        const order = await this.ordersRepository.findById(deliveryData.order);
        if (!order) {
            throw new CustomError(ERROR_CODES.ORDER_NOT_FOUND);
        }

        if (deliveryData.driver) {
            const driver = await this.usersRepository.findById(deliveryData.driver);
            if (!driver) {
                throw new CustomError(ERROR_CODES.DRIVER_NOT_FOUND);
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
            throw new CustomError(ERROR_CODES.DELIVERY_NOT_FOUND);
        }
        return updated;
    }

    async delete(id) {
        const deleted = await this.deliveriesRepository.delete(id);
        if (!deleted) {
            throw new CustomError(ERROR_CODES.DELIVERY_NOT_FOUND);
        }
        return deleted;
    }

    async addProof(deliveryId, file) {
    try {
        const delivery = await this.deliveriesRepository.findById(deliveryId);
        if (!delivery) {
            throw new CustomError(ERROR_CODES.DELIVERY_NOT_FOUND);}
        if (!file) {
            throw new CustomError(ERROR_CODES.FILE_REQUIRED);}
        const proofData = {
            originalName: file.originalname,
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            documentType: "delivery_proof",
            uploadedAt: new Date()
        };
        const updatedDelivery = await this.deliveriesRepository.addProof(deliveryId, proofData);
        logger.info(`Comprobante asociado correctamente a la entrega ${deliveryId}`);
        return updatedDelivery;
        } catch (error) {
            if (file?.path) {await deleteFile(file.path);}
            throw error;
        }
    }
}