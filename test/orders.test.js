import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("Orders API", () => {

    const fakeId = "507f1f77bcf86cd799439011";

    function createUserData() {
        return {
            firstName: "Customer",
            lastName: "OrderTest",
            email: `order${Date.now()}${Math.random()}@mail.com`,
            password: "123456"
        };}

    async function createCustomer() {
        const user = createUserData();
        const response = await request(app).post("/api/users").send(user);

        expect(response.status).to.equal(201);

        return response.body.payload;}

    function createOrderData(customerId) {
        return {
            customer: customerId,
            items: [
                {
                    name: "Producto Test",
                    quantity: 1,
                    price: 1000
                }
            ],
            deliveryAddress: "Direccion Test 123",
            paymentMethod: "card"
        };
    }


    async function createOrder() {

        const customer = await createCustomer();
        const newOrder = createOrderData(customer._id);
        const response = await request(app).post("/api/orders").send(newOrder);

        expect(response.status).to.equal(201);

        return response.body.payload;
    }


    function expectOrderNotFound(response) {
        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal("error");
        expect(response.body.error).to.equal("ORDER_NOT_FOUND");
        expect(response.body.message).to.equal("Pedido no encontrado");
    }


    // GET ALL

    it("GET /api/orders debería devolver una lista de pedidos", async () => {

        const response = await request(app).get("/api/orders");

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body).to.have.property("payload");
        expect(response.body.payload).to.be.an("array");
    });


    // GET BY ID

    it("GET /api/orders/:id debería devolver un pedido existente", async () => {

        const order = await createOrder();

        const response = await request(app).get(`/api/orders/${order._id}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body).to.have.property("payload");
        expect(response.body.payload).to.be.an("object");
        expect(response.body.payload).to.have.property("_id");
        expect(response.body.payload._id).to.equal(order._id);
    });


    // GET BY ID - NOT FOUND

    it("GET /api/orders/:id debería devolver 404 si el pedido no existe", async () => {

        const response = await request(app).get(`/api/orders/${fakeId}`);

        expectOrderNotFound(response);
    });


    // CREATE

    it("POST /api/orders debería crear un pedido correctamente", async () => {

        const customer = await createCustomer();

        const newOrder = {
            customer: customer._id,
            items: [
                {
                    name: "Producto Test",
                    quantity: 2,
                    price: 1000
                }
            ],
            deliveryAddress: "Direccion Test 123",
            paymentMethod: "card"
        };

        const response = await request(app).post("/api/orders").send(newOrder);

        expect(response.status).to.equal(201);
        expect(response.body.status).to.equal("success");
        expect(response.body).to.have.property("payload");
        expect(response.body.payload).to.be.an("object");
        expect(response.body.payload).to.have.property("_id");
        expect(response.body.payload.customer).to.exist;

        // El service calcula el total automáticamente
        expect(response.body.payload.total).to.equal(2000);
        expect(response.body.payload.status).to.equal("created");
        expect(response.body.payload.items).to.be.an("array");
        expect(response.body.payload.items).to.have.lengthOf(1);
    });


    // CREATE - INVALID ORDER

    it("POST /api/orders debería devolver 400 si el pedido no tiene items", async () => {

        const customer = await createCustomer();

        const invalidOrder = {
            customer: customer._id,
            items: [],
            deliveryAddress: "Direccion Test 123",
            paymentMethod: "card"
        };

        const response = await request(app).post("/api/orders").send(invalidOrder);

        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal("error");
        expect(response.body.error).to.equal("INVALID_ORDER");
        expect(response.body.message).to.equal("El pedido debe tener al menos un item");
    });


    // CREATE - CUSTOMER NOT FOUND

    it("POST /api/orders debería devolver 404 si el cliente no existe", async () => {

        const newOrder = createOrderData(fakeId);

        const response = await request(app).post("/api/orders").send(newOrder);

        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal("error");
        expect(response.body.error).to.equal("CUSTOMER_NOT_FOUND");
        expect(response.body.message).to.equal("El cliente especificado no existe");
    });


    // UPDATE

    it("PUT /api/orders/:id debería actualizar un pedido correctamente", async () => {

        const order = await createOrder();

        const response = await request(app).put(`/api/orders/${order._id}`).send({deliveryAddress: "Direccion Actualizada 456"});

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body).to.have.property("payload");
        expect(response.body.payload).to.be.an("object");
        expect(response.body.payload._id).to.equal(order._id);
        expect(response.body.payload.deliveryAddress).to.equal(
            "Direccion Actualizada 456"
        );
    });


    // UPDATE - NOT FOUND

    it("PUT /api/orders/:id debería devolver 404 si el pedido no existe", async () => {

        const response = await request(app).put(`/api/orders/${fakeId}`).send({deliveryAddress: "Direccion Test"});

        expectOrderNotFound(response);
    });


    // CANCEL

    it("POST /api/orders/:id/cancel debería cancelar un pedido correctamente", async () => {

        const order = await createOrder();

        const response = await request(app).post(`/api/orders/${order._id}/cancel`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body).to.have.property("payload");
        expect(response.body.payload).to.be.an("object");
        expect(response.body.payload._id).to.equal(order._id);
        expect(response.body.payload.status).to.equal("cancelled");
    });


    // CANCEL - NOT FOUND

    it("POST /api/orders/:id/cancel debería devolver 404 si el pedido no existe", async () => {

        const response = await request(app).post(`/api/orders/${fakeId}/cancel`);

        expectOrderNotFound(response);
    });


    // CANCEL - ALREADY DELIVERED

    it("POST /api/orders/:id/cancel debería devolver 400 si el pedido ya fue entregado", async () => {

        const order = await createOrder();

        const updateResponse = await request(app).put(`/api/orders/${order._id}`).send({status: "delivered"});

        expect(updateResponse.status).to.equal(200);

        const response = await request(app).post(`/api/orders/${order._id}/cancel`);

        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal("error");
        expect(response.body.error).to.equal("ORDER_ALREADY_DELIVERED");
        expect(response.body.message).to.equal(
            "No se puede cancelar un pedido ya entregado"
        );
    });


    // DELETE

    it("DELETE /api/orders/:id debería eliminar un pedido correctamente", async () => {

        const order = await createOrder();

        const response = await request(app).delete(`/api/orders/${order._id}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body.message).to.equal("Pedido eliminado");
    });


    // DELETE - NOT FOUND

    it("DELETE /api/orders/:id debería devolver 404 si el pedido no existe", async () => {

        const response = await request(app).delete(`/api/orders/${fakeId}`);

        expectOrderNotFound(response);
    });

});