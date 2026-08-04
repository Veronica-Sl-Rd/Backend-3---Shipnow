export const ERROR_CODES = {
    // Usuarios
    USER_NOT_FOUND: "USER_NOT_FOUND",
    USER_ALREADY_EXIST: 'USER_ALREADY_EXIST',
    CUSTOMER_NOT_FOUND: "CUSTOMER_NOT_FOUND",
    DRIVER_NOT_FOUND: "DRIVER_NOT_FOUND",
    ADMIN_CREATION_FORBIDDEN: "ADMIN_CREATION_FORBIDDEN",

    // Pedidos
    ORDER_NOT_FOUND: "ORDER_NOT_FOUND",
    INVALID_ORDER: "INVALID_ORDER",
    PAYMENT_REJECTED: "PAYMENT_REJECTED",
    ORDER_ALREADY_DELIVERED: "ORDER_ALREADY_DELIVERED",
    WEATHER_API_ERROR: "WEATHER_API_ERROR",

    // Entregas
    DELIVERY_NOT_FOUND: "DELIVERY_NOT_FOUND",

    // Mocking
    INVALID_MOCK_QUANTITY: "INVALID_MOCK_QUANTITY",
    MOCK_GENERATION_FAILED: "MOCK_GENERATION_FAILED",

    // Genéricos 
    VALIDATION_ERROR: "VALIDATION_ERROR",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    NOTIFICATION_FAILED: "NOTIFICATION_FAILED",
};

Object.freeze(ERROR_CODES);

export const ERROR_DICTIONARY = {
    [ERROR_CODES.USER_NOT_FOUND]: {
        statusCode: 404,
        message: "Usuario no encontrado"
    },

    [ERROR_CODES.CUSTOMER_NOT_FOUND]: {
        statusCode: 404,
        message: "El cliente especificado no existe"
    },

    [ERROR_CODES.USER_ALREADY_EXIST]: {
        statusCode: 400,
        message: 'El usuario ya existe'
    },

    [ERROR_CODES.DRIVER_NOT_FOUND]: {
        statusCode: 404,
        message: "El repartidor especificado no existe"
    },

    [ERROR_CODES.ADMIN_CREATION_FORBIDDEN]: {
    statusCode: 403,
    message: "No tienes permitido crear usuarios admin"
    },

    [ERROR_CODES.ORDER_NOT_FOUND]: {
        statusCode: 404,
        message: "Pedido no encontrado"
    },

    [ERROR_CODES.INVALID_ORDER]: {
        statusCode: 400,
        message: "El pedido debe tener al menos un item"
    },

    [ERROR_CODES.PAYMENT_REJECTED]: {
        statusCode: 502,
        message: "Pago rechazado"
    },

    [ERROR_CODES.ORDER_ALREADY_DELIVERED]: {
        statusCode: 400,
        message: "No se puede cancelar un pedido ya entregado"
    },

    [ERROR_CODES.DELIVERY_NOT_FOUND]: {
        statusCode: 404,
        message: "Entrega no encontrada"
    },

    [ERROR_CODES.WEATHER_API_ERROR]: {
    statusCode: 502,
    message: "No fue posible obtener la información del clima"
},

    [ERROR_CODES.INVALID_MOCK_QUANTITY]: {
        statusCode: 400,
        message: "La cantidad de datos a generar debe ser un número entero mayor que cero"
    },

    [ERROR_CODES.MOCK_GENERATION_FAILED]: {
        statusCode: 500,
        message: "No fue posible generar los datos de prueba"
    },

    [ERROR_CODES.VALIDATION_ERROR]: {
        statusCode: 400,
        message: "Faltan datos obligatorios"
    },

    [ERROR_CODES.INTERNAL_SERVER_ERROR]: {
        statusCode: 500,
        message: "Error interno del servidor"
    },

    [ERROR_CODES.NOTIFICATION_FAILED]: {
    statusCode: 502,
    message: "No fue posible enviar la notificación"
    }
}