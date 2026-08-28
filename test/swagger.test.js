import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("Swagger API", () => {

    it("GET /api/docs debería mostrar la documentación Swagger", async () => {
        const response = await request(app).get("/api/docs/");

        expect(response.status).to.equal(200);
        expect(response.type).to.match(/html/);
        expect(response.text).to.include("Swagger UI");
    });

});