const { messaging } = require('../config/firebase');

exports.sendPushNotification = async (fcmToken, title, body, data = {}) => {
    if (!messaging || !fcmToken) {
        console.warn('Skipping notification: Messaging not initialized or no token provided.');
        return;
    }

    const message = {
        notification: {
            title,
            body
        },
        data: {
            ...data,
            click_action: 'FLUTTER_NOTIFICATION_CLICK' // Standard for many cross-platform apps, adjustable for RN
        },
        token: fcmToken
    };

    try {
        const response = await messaging.send(message);
        console.log('Successfully sent message:', response);
        return response;
    } catch (error) {
        console.error('Error sending message:', error);
        // Don't throw, just log, so flow doesn't break
    }
};
