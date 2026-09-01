import deliveriesRepo from '../repositories/deliveries.repository.js';
import ordersRepo from '../repositories/orders.repository.js';
import usersRepo from '../repositories/users.repository.js';
import { getWeather } from '../utils/weather-api.js';
import DeliveriesService from '../services/deliveries.service.js';

const weatherApi =
    process.env.NODE_ENV === "test"
        ? {
            getWeather: async () => ({
                condition: "clear",
                temperature: 22
            })
        }
        : { getWeather };

const deliveriesService = new DeliveriesService(
    deliveriesRepo, ordersRepo, usersRepo, weatherApi, usersRepo
);

class DeliveriesController {
    async findAll(req, res, next) {
        try {
            const deliveries = await deliveriesService.findAll();
            res.json({ status: 'success', payload: deliveries });
        } catch (error) {
            next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const delivery = await deliveriesService.findById(req.params.id);
            res.json({ status: 'success', payload: delivery });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const delivery = await deliveriesService.create(req.body);
            res.status(201).json({ status: 'success', payload: delivery });
        } catch (error) {
            next(error);
        }
    }

    async checkDelivery(req, res, next) {
        try {
            const result = await deliveriesService.checkDelivery(req.params.city, req.query.orderId);
            res.json({ status: 'success', payload: result });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const updated = await deliveriesService.update(req.params.id, req.body);
            res.json({ status: 'success', payload: updated });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await deliveriesService.delete(req.params.id);
            res.json({ status: 'success', message: 'Entrega eliminada' });
        } catch (error) {
            next(error);
        }
    }

    async addProof(req, res, next) {
    try {
        const updatedDelivery = await deliveriesService.addProof(
            req.params.id,
            req.file
        );
        res.status(200).json({
            status: "success",
            message: "Comprobante cargado correctamente",
            payload: updatedDelivery
        });
        } catch (error) {
            next(error);
        }
    }
}

export default new DeliveriesController();