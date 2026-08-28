export const paymentGatewayStub = {
    charge: () => {
        return {
            success: true,
            transactionId: "txn-abc",
            amount: 500
        };
    }
};

export const notificationStub = {
    sendNotification: () => {
        return true;
    }
};