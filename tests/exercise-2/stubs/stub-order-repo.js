import { jest } from '@jest/globals';

export const stubOrderRepository = {
    create: jest.fn(async (data) => ({
        _id: "order-123",
        ...data
    }))
};