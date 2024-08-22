// firebaseConfig.js
const admin = require('firebase-admin');
const serviceAccount = require('./q-proj-firebase-adminsdk-pwdy5-b1094ea2a1.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});

const database = admin.database();
module.exports = database;
