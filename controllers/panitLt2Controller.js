const SapiModel = require("../models/sapiModel");
const database = require("../firebaseConfig");

// ! FUNCTION TO HELP
async function isSapiExist(sapiId) {
    const snapshot = await database.ref('sapi').child(sapiId).once('value');
    return snapshot.exists();
}
async function isSapiState(sapiId, expectedState) {
    const sapiRef = database.ref(`sapi/${sapiId}/state`);
    const snapshot = await sapiRef.once('value');

    if (!snapshot.exists()) {
        console.log('State tidak ditemukan');
        return false; // Atau return null/undefined sesuai kebutuhanmu
    }

    const state = snapshot.val();

    return state === expectedState;
}



// ! REALISASI
module.exports.getPanitLt2Dashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("panitLt2Dashboard", { currentUser, firebaseConfig });
}

module.exports.setPemrosesanDagingDashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("setPemrosesanDagingDashboard", { currentUser, firebaseConfig });
}
module.exports.revertPemrosesanDagingDashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("revertPemrosesanDagingDashboard", { currentUser, firebaseConfig });
}
module.exports.setReadyDeliverDashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("setReadyDeliverDashboard", { currentUser, firebaseConfig });
}
module.exports.revertReadyDeliverDashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("revertReadyDeliverDashboard", { currentUser, firebaseConfig });
}


module.exports.setReadyDeliver = async (req, res) => {
    try {

        // TODO ambil parameter (idSapi)
        const { idSapi } = req.body;
        // TODO cek apakah sapi dengan id tersebut ada
        const exist = await isSapiExist(idSapi);
        if (!exist) {
            return res.status(400).json({ message: "sapi does not exist" })
        }
        // TODO cek apakah state dari sapi adalah "Pemrosesan Daging"
        const state = await isSapiState(idSapi, "Pemrosesan Daging");
        if (!state) {
            return res.status(400).json({ message: `sapi state is prohibited to be set to "Siap Dibagikan"` })
        }
        // TODO ganti state dari sapi menjadi "Siap Dibagikan"
        await SapiModel.updateSapiState(idSapi, "Siap Dibagikan");
        res.status(200).json({ message: "sapi state updated sucessfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports.revertReadyDeliver = async (req, res) => {
    try {

        // TODO ambil parameter (idSapi)
        const { idSapi } = req.body;
        // TODO cek apakah sapi dengan id tersebut ada
        const exist = await isSapiExist(idSapi);
        if (!exist) {
            return res.status(400).json({ message: "sapi does not exist" })
        }
        // TODO cek apakah state dari sapi adalah "Siap Dibagikan"
        const state = await isSapiState(idSapi, "Siap Dibagikan");
        if (!state) {
            return res.status(400).json({ message: `sapi state is prohibited to be set to "Pemrosesan Daging"` })
        }
        // TODO ganti state dari sapi menjadi "Pemrosesan Daging"
        await SapiModel.updateSapiState(idSapi, "Pemrosesan Daging");
        res.status(200).json({ message: "sapi state updated sucessfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports.pemrosesanDaging = async (req, res) => {
    try {

        // TODO ambil parameter (idSapi)
        const { idSapi } = req.body;
        // TODO cek apakah sapi dengan id tersebut ada
        const exist = await isSapiExist(idSapi);
        if (!exist) {
            return res.status(400).json({ message: "sapi does not exist" })
        }
        // TODO cek apakah state dari sapi adalah "Proses Penyembelihan"
        const state = await isSapiState(idSapi, "Proses Penyembelihan");
        if (!state) {
            return res.status(400).json({ message: `sapi state is prohibited to be set to "Pemrosesan Daging"` })
        }
        // TODO ganti state dari sapi menjadi "Pemrosesan Daging"
        await SapiModel.updateSapiState(idSapi, "Pemrosesan Daging");
        res.status(200).json({ message: "sapi state updated sucessfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports.revertPemrosesanDaging = async (req, res) => {
    try {

        // TODO ambil parameter (idSapi)
        const { idSapi } = req.body;
        // TODO cek apakah sapi dengan id tersebut ada
        const exist = await isSapiExist(idSapi);
        if (!exist) {
            return res.status(400).json({ message: "sapi does not exist" })
        }
        // TODO cek apakah state dari sapi adalah "Pemrosesan Daging"
        const state = await isSapiState(idSapi, "Pemrosesan Daging");
        if (!state) {
            return res.status(400).json({ message: `sapi state is prohibited to be set to "Proses Penyembelihan"` })
        }
        // TODO ganti state dari sapi menjadi "Proses Penyembelihan"
        await SapiModel.updateSapiState(idSapi, "Proses Penyembelihan");
        res.status(200).json({ message: "sapi state updated sucessfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}