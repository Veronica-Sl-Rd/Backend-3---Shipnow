import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Shipnow",
            version: "1.0.0",
            description: "Documentación de la api de Shipnow"
        },
        servers: [
            { url: "http://localhost:8080", description: "local" }
        ]
    },
    apis: ["./src/docs/**/*.yaml"]
}

export const swaggerSpec = swaggerJSDoc(swaggerOptions);