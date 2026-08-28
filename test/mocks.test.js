import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("Mocks API", () => {

    function expectInvalidQuantity(response) {
        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal("error");
        expect(response.body.error).to.equal("INVALID_MOCK_QUANTITY");
        expect(response.body.message).to.equal("La cantidad de datos a generar debe ser un número entero mayor que cero");}

    // MOCK USERS
    it("GET /api/mocks/mockingusers debería generar usuarios mock", async () => {
    const response = await request(app).get("/api/mocks/mockingusers?quantity=5");

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body).to.have.property("payload");

    const payload = response.body.payload;

    expect(payload).to.be.an("object");
    expect(payload).to.have.property("customers");
    expect(payload).to.have.property("drivers");

    expect(payload.customers).to.be.an("array");
    expect(payload.drivers).to.be.an("array");

    expect(payload.customers).to.have.lengthOf(5);
    expect(payload.drivers).to.have.lengthOf(5);

    const customer = payload.customers[0];

    expect(customer).to.have.property("firstName");
    expect(customer).to.have.property("lastName");
    expect(customer).to.have.property("email");
    expect(customer).to.have.property("role");
});

    // MOCK ORDERS
    it("GET /api/mocks/mockingorders debería generar pedidos mock", async () => {
        const response = await request(app).get("/api/mocks/mockingorders?quantity=5");

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body).to.have.property("payload");
        expect(response.body.payload).to.be.an("array");
        expect(response.body.payload).to.have.lengthOf(5);

        const order = response.body.payload[0];

        expect(order).to.have.property("customer");
        expect(order).to.have.property("items");
        expect(order.items).to.be.an("array");
        expect(order).to.have.property("deliveryAddress");
    });

    // GENERATE DATA
    it("POST /api/mocks/generateData debería generar y persistir datos mock", async () => {
        const response = await request(app).post("/api/mocks/generateData").send({quantity: 3});

        expect(response.status).to.equal(201);
        expect(response.body.status).to.equal("success");
        expect(response.body.message).to.equal("Datos de prueba generados correctamente");
        expect(response.body).to.have.property("payload");
        expect(response.body.payload).to.be.an("object");
    });

    // INVALID QUANTITY - USERS
    it("GET /api/mocks/mockingusers debería devolver 400 si quantity es inválida", async () => {
        const response = await request(app).get("/api/mocks/mockingusers?quantity=0");

        expectInvalidQuantity(response);
    });

    // INVALID QUANTITY - ORDERS
    it("GET /api/mocks/mockingorders debería devolver 400 si quantity es inválida", async () => {
        const response = await request(app).get("/api/mocks/mockingorders?quantity=-1");

        expectInvalidQuantity(response);
    });

    // INVALID QUANTITY - GENERATE DATA
    it("POST /api/mocks/generateData debería devolver 400 si quantity es inválida", async () => {
        const response = await request(app).post("/api/mocks/generateData").send({quantity: 0});

        expectInvalidQuantity(response);
    });

    // INVALID QUANTITY - DECIMAL
    it("GET /api/mocks/mockingusers debería devolver 400 si quantity no es un número entero", async () => {
        const response = await request(app).get("/api/mocks/mockingusers?quantity=2.5");

        expectInvalidQuantity(response);
    });

});