import { USER_ROLES } from "../constants/index.js";

export const generateMockUser = (index) => {
    return {
        firstName: `Usuario${index}`,
        lastName: "Demo",
        email: `user${index}-${Date.now()}@test.com`,
        password: "coder123",
        role: USER_ROLES.CUSTOMER,
        city: "Buenos Aires",
        documents: []
    };
};

export const generateMockDriver = (index) => {
    return {
        firstName: `Repartidor${index}`,
        lastName: "Demo",
        email: `driver${index}-${Date.now()}@test.com`,
        password: "coder123",
        role: USER_ROLES.DRIVER,
        city: "Buenos Aires",
        available: true,
        vehicle: "motorcycle",
        documents: []
    };
};