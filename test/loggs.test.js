import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("Logger API", () => {

    it("GET /api/logger/test debería ejecutar todos los niveles del logger", async () => {
        const response = await request(app).get("/api/logger/test");

        expect(response.status).to.equal(200);

        expect(response.body).to.be.an("object");
        expect(response.body.status).to.equal("success");
        expect(response.body.message).to.equal("Todos los niveles de logger fueron ejecutados");
    });

});