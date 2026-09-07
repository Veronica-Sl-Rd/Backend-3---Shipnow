import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("Health Check", () => {

    it("GET /api/health debería devolver el estado de la API", async () => {
        const response = await request(app).get("/api/health");

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("ok");
        expect(response.body).to.have.property("environment");
        expect(response.body).to.have.property("uptime");
        expect(response.body).to.have.property("timestamp");
    });
});