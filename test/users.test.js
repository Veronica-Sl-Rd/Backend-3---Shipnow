import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("Users API", () => {

    const fakeId = "507f1f77bcf86cd799439011";

    async function createUser() {
        const newUser = {
            firstName: "Usuario",
            lastName: "Test",
            email: `test${Date.now()}${Math.random()}@mail.com`,
            password: "123456"
        };
        const response = await request(app).post("/api/users").send(newUser);
        expect(response.status).to.equal(201);
        return response.body.payload;
    }

    function expectUserNotFound(response) {
        expect(response.status).to.equal(404);
        expect(response.body.status).to.equal("error");
        expect(response.body.error).to.equal("USER_NOT_FOUND");
        expect(response.body.message).to.equal("Usuario no encontrado");
    }


    // GET ALL
    it("GET /api/users debería devolver una lista de usuarios", async () => {

        const response = await request(app).get("/api/users");

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body).to.have.property("payload");
        expect(response.body.payload).to.be.an("array");
    });


    // GET BY ID
    it("GET /api/users/:uid debería devolver un usuario existente", async () => {

        const user = await createUser();

        const response = await request(app).get(`/api/users/${user._id}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body.payload).to.be.an("object");
        expect(response.body.payload._id).to.equal(user._id);
    });


    // GET BY ID - NOT FOUND
    it("GET /api/users/:uid debería devolver 404 si el usuario no existe", async () => {

        const response = await request(app).get(`/api/users/${fakeId}`);

        expectUserNotFound(response);
    });


    // CREATE
    it("POST /api/users debería crear un usuario correctamente", async () => {

        const newUser = {
            firstName: "Usuario",
            lastName: "Test",
            email: `create${Date.now()}@mail.com`,
            password: "123456"
        };

        const response = await request(app).post("/api/users").send(newUser);

        expect(response.status).to.equal(201);
        expect(response.body.status).to.equal("success");
        expect(response.body).to.have.property("payload");
        expect(response.body.payload).to.be.an("object");
        expect(response.body.payload).to.have.property("_id");
        expect(response.body.payload.firstName).to.equal("Usuario");
        expect(response.body.payload.lastName).to.equal("Test");

        // El service establece customer por defecto
        expect(response.body.payload.role).to.equal("customer");
    });


    // CREATE - VALIDATION
    it("POST /api/users debería devolver 400 si faltan datos obligatorios", async () => {

        const incompleteUser = {
            firstName: "Usuario",
            email: `incompleto${Date.now()}@mail.com`
        };

        const response = await request(app).post("/api/users").send(incompleteUser);

        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal("error");
        expect(response.body.error).to.equal("VALIDATION_ERROR");
        expect(response.body.message).to.equal("Faltan datos obligatorios");
    });


    // CREATE - ADMIN FORBIDDEN
    it("POST /api/users debería devolver 403 al intentar crear un usuario admin", async () => {

        const adminUser = {
            firstName: "Admin",
            lastName: "Test",
            email: `admin${Date.now()}@mail.com`,
            password: "123456",
            role: "admin"
        };

        const response = await request(app).post("/api/users").send(adminUser);

        expect(response.status).to.equal(403);
        expect(response.body.status).to.equal("error");
        expect(response.body.error).to.equal("ADMIN_CREATION_FORBIDDEN");
        expect(response.body.message).to.equal("No tienes permitido crear usuarios admin");
    });


    // CREATE - DUPLICATE EMAIL
    it("POST /api/users debería devolver 400 si el email ya existe", async () => {

        const user = {
            firstName: "Usuario",
            lastName: "Original",
            email: `duplicado${Date.now()}@mail.com`,
            password: "123456"
        };

        const firstResponse = await request(app).post("/api/users").send(user);

        expect(firstResponse.status).to.equal(201);

        const secondResponse = await request(app).post("/api/users").send(user);

        expect(secondResponse.status).to.equal(400);
        expect(secondResponse.body.status).to.equal("error");
        expect(secondResponse.body.error).to.equal("USER_ALREADY_EXIST");
        expect(secondResponse.body.message).to.equal("El usuario ya existe");
    });


    // DELETE
    it("DELETE /api/users/:uid debería eliminar un usuario correctamente", async () => {

        const user = await createUser();

        const response = await request(app).delete(`/api/users/${user._id}`);

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Usuario eliminado");
    });


    // DELETE - NOT FOUND
    it("DELETE /api/users/:uid debería devolver 404 si el usuario no existe", async () => {

        const response = await request(app).delete(`/api/users/${fakeId}`);

        expectUserNotFound(response);
    });

});