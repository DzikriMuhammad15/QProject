const database = require("../firebaseConfig");

// ! REALISASI
module.exports.getMudhohiDashboard = (req, res) => {
    const currentUser = res.locals.user;
    const currentMudhohi = res.locals.mudhohi;
    console.log({ role: "mudhohi", currentUser, currentMudhohi });
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("MudhohiDashboard", { currentUser, currentMudhohi, firebaseConfig: {apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL } })
}