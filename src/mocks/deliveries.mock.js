import { DELIVERY_STATUS, DELIVERY_PRIORITY } from "../constants/index.js";

export const generateMockDelivery = (orderId, driverId) => {

    return {
        order: orderId,
        driver: driverId,
        status: DELIVERY_STATUS.PENDING,
        priority: DELIVERY_PRIORITY.NORMAL,
    };
};