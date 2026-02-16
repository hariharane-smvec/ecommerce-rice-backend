const admin = require('firebase-admin');
require('dotenv').config();

let db = null;
let messaging = null;

try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : null;

    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        db = admin.firestore();
        messaging = admin.messaging();
        console.log('Firebase Admin Initialized');
    } else {
        console.warn('WARNING: Firebase Service Account not found. Running in MOCK mode.');
    }
} catch (error) {
    console.error('Error initializing Firebase:', error);
}

module.exports = { admin, db, messaging };
