import { expect } from "chai";
import request from "supertest";
import fs from "fs/promises";
import app from "../src/app.js";

const fakeId = "507f1f77bcf86cd799439011";

const uploadedFiles = [];

async function createUser() {
    const user = {
        firstName: "Upload",
        lastName: "Test",
        email: `upload${Date.now()}${Math.random()}@mail.com`,
        password: "123456"
    };
    const response = await request(app).post("/api/users").send(user);
    expect(response.status).to.equal(201);
    return response.body.payload;
}

async function createOrder() {
    const customer = await createUser();
    const order = {
        customer: customer._id,
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
    const response = await request(app).post("/api/orders").send(order);
    expect(response.status).to.equal(201);
    return response.body.payload;
}

async function createDelivery() {
    const order = await createOrder();
    const response = await request(app).post("/api/deliveries").send({order: order._id});
    expect(response.status).to.equal(201);
    return response.body.payload;
}

async function cleanUploadedFiles() {
    for (const filePath of uploadedFiles) {
        try {
            await fs.unlink(filePath);
        } catch (error) {
            if (error.code !== "ENOENT") {
                throw error;
            }
        }
    }
    uploadedFiles.length = 0;
}

describe("Uploads API", () => {
    afterEach(async () => {
        await cleanUploadedFiles();
    });

    describe("User documents", () => {
        it("POST /api/users/:uid/documents debería cargar un documento correctamente", async () => {
            const user = await createUser();
            const response = await request(app)
                .post(`/api/users/${user._id}/documents`)
                .field("documentType", "dni")
                .attach(
                    "file",
                    Buffer.from("contenido de prueba"),
                    "documento.pdf"
                );

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal("success");
            expect(response.body.message).to.equal("Documento cargado correctamente");
            expect(response.body.payload.documents).to.be.an("array");
            expect(response.body.payload.documents).to.have.lengthOf(1);

            const document = response.body.payload.documents[0];

            expect(document.originalName).to.equal("documento.pdf");
            expect(document.filename).to.be.a("string");
            expect(document.path).to.be.a("string");
            expect(document.mimetype).to.equal("application/pdf");
            expect(document.size).to.be.a("number");
            expect(document.documentType).to.equal("dni");
            expect(document.uploadedAt).to.exist;

            uploadedFiles.push(document.path);
        });

        it("POST /api/users/:uid/documents debería devolver error si falta el archivo", async () => {
            const user = await createUser();
            const response = await request(app).post(`/api/users/${user._id}/documents`).field("documentType", "dni");

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal("error");
            expect(response.body.error).to.equal("FILE_REQUIRED");
            expect(response.body.message).to.equal("El archivo es obligatorio");
        });

        it("POST /api/users/:uid/documents debería devolver error si el tipo de documento es inválido", async () => {
            const user = await createUser();
            const response = await request(app)
                .post(`/api/users/${user._id}/documents`)
                .field("documentType", "pasaporte")
                .attach(
                    "file",
                    Buffer.from("contenido de prueba"),
                    "documento.pdf"
                );

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal("error");
            expect(response.body.error).to.equal(
                "INVALID_DOCUMENT_TYPE"
            );
            expect(response.body.message).to.equal(
                "El tipo de documento no es válido"
            );
        });

    });

    describe("Delivery proofs", () => {
        it("POST /api/deliveries/:id/proof debería cargar un comprobante correctamente", async () => {
            const delivery = await createDelivery();
            const response = await request(app)
                .post(`/api/deliveries/${delivery._id}/proof`)
                .attach(
                    "file",
                    Buffer.from("imagen de comprobante"),
                    "comprobante.jpg"
                );

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal("success");
            expect(response.body.message).to.equal(
                "Comprobante cargado correctamente"
            );

            const proof = response.body.payload.proof;

            expect(proof).to.be.an("object");
            expect(proof.originalName).to.equal("comprobante.jpg");
            expect(proof.filename).to.be.a("string");
            expect(proof.path).to.be.a("string");
            expect(proof.mimetype).to.equal("image/jpeg");
            expect(proof.size).to.be.a("number");
            expect(proof.documentType).to.equal("delivery_proof");
            expect(proof.uploadedAt).to.exist;

            uploadedFiles.push(proof.path);
        });

        it("POST /api/deliveries/:id/proof debería devolver error si la entrega no existe", async () => {
            const response = await request(app).post(`/api/deliveries/${fakeId}/proof`)
                .attach(
                    "file",
                    Buffer.from("imagen de comprobante"),
                    "comprobante.jpg"
                );

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal("error");
            expect(response.body.error).to.equal("DELIVERY_NOT_FOUND");
            expect(response.body.message).to.equal(
                "Entrega no encontrada"
            );
        });
    });
});