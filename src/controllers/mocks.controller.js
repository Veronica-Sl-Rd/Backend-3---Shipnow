import mocksService from "../services/mocks.service.js";

class MocksController {

    async getMockUsers(req, res, next) {
    try {
        const quantity = Number(req.query.quantity ?? 50);
        const users = await mocksService.getMockUsers(quantity);
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
        const quantity = Number(req.query.quantity ?? 50);
        const orders = await mocksService.getMockOrders(quantity);
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
        const quantity = Number(req.body.quantity ?? 50);
        const result = await mocksService.generateData(quantity);
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