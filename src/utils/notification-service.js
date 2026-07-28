const NOTIFICATION_API_URL = 'https://api.notifications.com/v1/send';

export async function sendNotification(userId, message) {
    const response = await fetch(NOTIFICATION_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message })
    });

    if (!response.ok) {
        throw new Error(`Notification failed: ${response.statusText}`);
    }

    return { sent: true, userId, message };
}