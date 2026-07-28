import mocksService from "../services/mocks.service.js";

class MocksController {

    async getMockUsers(req, res, next) {
        try {
        const users = await mocksService.getMockUsers(50);

        res.json({
            status: "success",
            payload: users
        });
        } catch (error) {
            next(error);
        }
    }

    async getMockOrders(req, res, next) {
        try {
            const orders = await mocksService.getMockOrders(50);

            res.json({
                status: "success",
                payload: orders
            });
        } catch (error) {
            next(error);
        }
    }

    async generateData(req, res, next) {
        try {
            const result = await mocksService.generateData(50);

            res.status(201).json({
                status: "success",
                message: "Datos de prueba generados correctamente",
                payload: result
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new MocksController();