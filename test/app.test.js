import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("App API", () => {

    it("debería devolver 404 si la ruta no existe", async () => {
        const response = await request(app).get("/api/ruta-que-no-existe");

        expect(response.status).to.equal(404);
        expect(response.body).to.be.an("object");
        expect(response.body.status).to.equal("error");
        expect(response.body.message).to.equal("Ruta no encontrada");
    });

});