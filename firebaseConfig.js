// firebaseConfig.js
const admin = require('firebase-admin');
const serviceAccount = require('./q-project-d805e-firebase-adminsdk-fbsvc-5eb640e58a.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});

const database = admin.database();
module.exports = database;
