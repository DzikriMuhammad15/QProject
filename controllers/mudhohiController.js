const database = require("../firebaseConfig");

// ! REALISASI
module.exports.getMudhohiDashboard = (req, res) => {
    const currentUser = res.locals.user;
    const currentMudhohi = res.locals.mudhohi;
    console.log({ role: "mudhohi", currentUser, currentMudhohi });
    res.status(200).json({ role: "mudhohi", currentUser, currentMudhohi });
}