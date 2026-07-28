import { ORDER_STATUS, DELIVERY_PRIORITY } from "../constants/index.js";

export const generateMockOrder = (customerId) => {

    const items = [
        {
            name: "Paquete mediano",
            quantity: 2,
            price: 1500
        }
    ];

    const total = items.reduce((acc, item) => {
        return acc + (item.quantity * item.price);
    }, 0);

    return {
        customer: customerId,
        items,
        deliveryAddress: "Av. Siempre Viva 742",
        paymentMethod: "card",
        total,
        status: ORDER_STATUS.CREATED,
        priority: DELIVERY_PRIORITY.NORMAL
    };
};