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
module.exports.getPanitLt1Dashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("panitLt1Dashboard", { currentUser, firebaseConfig });
}
module.exports.getChangeStatusPanitLt1Dashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("changeStatusPanitLt1", { currentUser, firebaseConfig });
}
module.exports.getRevertStatusPanitLt1Dashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("revertStatusPanitLt1", { currentUser, firebaseConfig });
}



module.exports.sembelih = async (req, res) => {
    try {
        // TODO ambil inputan parameter (idSapi)
        const { idSapi } = req.body;
        // TODO cek apakah sapi dengan id tsb ada
        const exist = await isSapiExist(idSapi);
        if (!exist) {
            return res.status(400).json({ message: "sapi does not exist" })
        }
        // TODO cek apakah state dari sapi adalah "belum disembelih"
        const state = await isSapiState(idSapi, "Belum Disembelih");
        if (!state) {
            return res.status(400).json({ message: `sapi state is prohibited to be set to "Proses Penyembelihan"` })
        }
        // TODO ubah state sapi menjadi "Proses Penyembelihan"
        await SapiModel.updateSapiState(idSapi, "Proses Penyembelihan");
        res.status(200).json({ message: "sapi state updated sucessfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports.revertSembelih = async (req, res) => {
    try {
        // TODO ambil inputan parameter (idSapi)
        const { idSapi } = req.body;
        // TODO cek apakah sapi dengan id tsb ada
        const exist = await isSapiExist(idSapi);
        if (!exist) {
            return res.status(400).json({ message: "sapi does not exist" })
        }
        // TODO cek apakah state dari sapi adalah "Proses Penyembelihan"
        const state = await isSapiState(idSapi, "Proses Penyembelihan");
        if (!state) {
            return res.status(400).json({ message: `sapi state is prohibited to be set to "Belum Disembelih"` })
        }
        // TODO ubah state sapi menjadi "Belum Disembelih"
        await SapiModel.updateSapiState(idSapi, "Belum Disembelih");
        res.status(200).json({ message: "sapi state updated sucessfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}