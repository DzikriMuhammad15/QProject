// firebaseConfig.js
const admin = require('firebase-admin');

console.log('FIREBASE_SERVICE_ACCOUNT exists:', !!process.env.FIREBASE_SERVICE_ACCOUNT);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('FIREBASE_SERVICE_ACCOUNT first 30 chars:', (process.env.FIREBASE_SERVICE_ACCOUNT || '').substring(0, 30));

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error('Environment variable FIREBASE_SERVICE_ACCOUNT is not set.');
}
if (!process.env.DATABASE_URL) {
    throw new Error('Environment variable DATABASE_URL is not set.');
}

let serviceAccount;
try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (e) {
    throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT: ' + e.message);
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});

const database = admin.database();
module.exports = database;