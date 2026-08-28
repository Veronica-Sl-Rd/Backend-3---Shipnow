import { USER_ROLES, ORDER_STATUS, DELIVERY_PRIORITY } from '../../src/constants'

export const data = {
    // --- Usuarios ---
    user: {
        firstName: 'Camila',
        lastName: 'Torres',
        email: 'camila.torres@test.com',
        password: 'coder123',
        role: USER_ROLES.CUSTOMER
    },

    // --- Repartidor (User con role driver) ---
    driver: {
        firstName: 'Carlos',
        lastName: 'García',
        email: 'carlos.garcia@test.com',
        password: 'coder123',
        role: USER_ROLES.DRIVER,
        city: 'Buenos Aires',
        available: true,
        vehicle: 'motorcycle'
    },

    // --- Pedido válido ---
    order: {
        customer: 'user-id-123',
        items: [
            { name: 'Paquete mediano', quantity: 2, price: 1500 },
            { name: 'Paquete pequeño', quantity: 1, price: 800 }
        ],
        deliveryAddress: 'Av. Siempre Viva 742',
        paymentMethod: 'card',
        priority: DELIVERY_PRIORITY.NORMAL
    },

    // --- Usuario con datos inválidos (para testing de validación) ---
    incorrect_user: {
        firstName: '',
        lastName: '',
        email: 'invalido',
        password: ''
    },

    // --- Pedido inválido (sin items) ---
    incorrect_order: {
        customer: 'user-id-123',
        items: [],
        deliveryAddress: '',
        paymentMethod: 'card'
    }
};