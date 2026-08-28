import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("Deliveries API", () => {

    const fakeId = "507f1f77bcf86cd799439011";

    async function createCustomer() {
        const response = await request(app).post("/api/users")
            .send({
                firstName: "Cliente",
                lastName: "DeliveryTest",
                email: `delivery${Date.now()}${Math.random()}@mail.com`,
                password: "123456"
            });

        expect(response.status).to.equal(201);

        return response.body.payload;
    }

    async function createOrder() {
        const customer = await createCustomer();

        const response = await request(app).post("/api/orders")
            .send({
                customer: customer._id,
                items: [
                    {
                        name: "Producto Test",
                        quantity: 1,
                        price: 1000
                    }
                ],
                deliveryAddress: "Calle Test 123"
            });

        expect(response.status).to.equal(201);

        return response.body.payload;
    }

    async function createDriver() {
        const response = await request(app).post("/api/users")
            .send({
                firstName: "Driver",
                lastName: "Test",
                email: `driver${Date.now()}${Math.random()}@mail.com`,
                password: "123456",
                role: "driver",
                city: "Lanus"
            });

        expect(response.status).to.equal(201);

        return response.body.payload;
    }

    async function createDelivery() {
        const order = await createOrder();
        const driver = await createDriver();

        const response = await request(app).post("/api/deliveries")
            .send({
                order: order._id,
                driver: driver._id,
                status: "pending",
                priority: "normal"
            });

        expect(response.status).to.equal(201);

        return response.body.payload;
    }

    // GET ALL
    it("GET /api/deliveries debería devolver una lista de entregas", async () => {
        const response = await request(app).get("/api/deliveries");

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body).to.have.property("payload");
        expect(response.body.payload).to.be.an("array");
    });

    // GET BY ID
    it("GET /api/deliveries/:id debería devolver una entrega existente", async () => {
        const delivery = await createDelivery();

        const response = await request(app).get(`/api/deliveries/${delivery._id}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body.payload).to.be.an("object");
        expect(response.body.payload._id).to.equal(delivery._id);
    });

    // GET BY ID - NOT FOUND
    it("GET /api/deliveries/:id debería devolver 404 si la entrega no existe", async () => {
        const response = await request(app).get(`/api/deliveries/${fakeId}`);

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal("error");
        expect(response.body.error).to.equal("DELIVERY_NOT_FOUND");
        expect(response.body.message).to.equal("Entrega no encontrada");
    });

    // CREATE
    it("POST /api/deliveries debería crear una entrega correctamente", async () => {
        const order = await createOrder();
        const driver = await createDriver();

        const response = await request(app).post("/api/deliveries")
            .send({
                order: order._id,
                driver: driver._id,
                priority: "high"
            });

        expect(response.status).to.equal(201);
        expect(response.body.status).to.equal("success");
        expect(response.body).to.have.property("payload");

        const delivery = response.body.payload;

        expect(delivery).to.have.property("_id");
        expect(delivery.priority).to.equal("high");
        expect(delivery.status).to.equal("pending");
    });

    // CREATE - ORDER NOT FOUND
    it("POST /api/deliveries debería devolver 404 si el pedido no existe", async () => {
        const response = await request(app).post("/api/deliveries")
            .send({
                order: fakeId,
                priority: "normal"
            });

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal("error");
        expect(response.body.error).to.equal("ORDER_NOT_FOUND");
        expect(response.body.message).to.equal("Pedido no encontrado");
    });

    // CREATE - DRIVER NOT FOUND
    it("POST /api/deliveries debería devolver 404 si el repartidor no existe", async () => {
        const order = await createOrder();

        const response = await request(app).post("/api/deliveries")
            .send({
                order: order._id,
                driver: fakeId
            });

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal("error");
        expect(response.body.error).to.equal("DRIVER_NOT_FOUND");
        expect(response.body.message).to.equal(
            "El repartidor especificado no existe"
        );
    });

    // UPDATE
    it("PUT /api/deliveries/:id debería actualizar una entrega correctamente", async () => {
        const delivery = await createDelivery();

        const response = await request(app).put(`/api/deliveries/${delivery._id}`)
            .send({
                status: "in_transit",
                priority: "high"
            });

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body.payload.status).to.equal("in_transit");
        expect(response.body.payload.priority).to.equal("high");
    });

    // UPDATE - NOT FOUND
    it("PUT /api/deliveries/:id debería devolver 404 si la entrega no existe", async () => {
        const response = await request(app).put(`/api/deliveries/${fakeId}`)
            .send({
                status: "in_transit"
            });

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal("error");
        expect(response.body.error).to.equal("DELIVERY_NOT_FOUND");
        expect(response.body.message).to.equal("Entrega no encontrada");
    });

    // DELETE
    it("DELETE /api/deliveries/:id debería eliminar una entrega correctamente", async () => {
        const delivery = await createDelivery();

        const response = await request(app).delete(`/api/deliveries/${delivery._id}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body.message).to.equal("Entrega eliminada");
    });

    // DELETE - NOT FOUND
    it("DELETE /api/deliveries/:id debería devolver 404 si la entrega no existe", async () => {
        const response = await request(app).delete(`/api/deliveries/${fakeId}`);

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal("error");
        expect(response.body.error).to.equal("DELIVERY_NOT_FOUND");
        expect(response.body.message).to.equal("Entrega no encontrada");
    });

    // CHECK DELIVERY - AVAILABLE
    it("GET /api/deliveries/check/:city debería indicar que la entrega es posible si hay buen clima y un driver disponible", async () => {
        await createDriver();

        const response = await request(app).get("/api/deliveries/check/Lanus");

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body).to.have.property("payload");

        const result = response.body.payload;

        expect(result.deliverable).to.equal(true);
        expect(result).to.have.property("driver");
        expect(result.driver).to.have.property("id");
        expect(result).to.have.property("estimatedTime");
        expect(result).to.have.property("weather");
    });


    // CHECK DELIVERY - NO DRIVER
    it("GET /api/deliveries/check/:city debería indicar que la entrega no es posible si no hay drivers disponibles", async () => {
        const response = await request(app).get("/api/deliveries/check/CiudadSinDrivers");

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body).to.have.property("payload");

        const result = response.body.payload;

        expect(result.deliverable).to.equal(false);
        expect(result.reason).to.equal("No hay repartidores disponibles en esta zona");
        expect(result).to.have.property("weather");
    });

});