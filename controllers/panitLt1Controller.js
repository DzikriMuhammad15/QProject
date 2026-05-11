const SapiModel = require("../models/sapiModel");
const KambingModel = require("../models/kambingModel");
const database = require("../firebaseConfig");

// ! FUNCTION TO HELP
async function isHewanExist(jenis, hewanId) {
    const ref = jenis === 'kambing' ? 'kambing' : 'sapi';
    const snapshot = await database.ref(ref).child(hewanId).once('value');
    return snapshot.exists();
}

async function isHewanState(jenis, hewanId, expectedState) {
    const ref = jenis === 'kambing' ? `kambing/${hewanId}/state` : `sapi/${hewanId}/state`;
    const snapshot = await database.ref(ref).once('value');
    if (!snapshot.exists()) {
        return false;
    }
    return snapshot.val() === expectedState;
}


// ! REALISASI
module.exports.getPanitLt1Dashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("panitLt1Dashboard", { currentUser, firebaseConfig: { apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL } });
}

module.exports.getChangeStatusPanitLt1Dashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("changeStatusPanitLt1", { currentUser, firebaseConfig: { apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL } });
}

module.exports.getRevertStatusPanitLt1Dashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("revertStatusPanitLt1", { currentUser, firebaseConfig: { apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL } });
}


// Sembelih: Belum Disembelih -> Proses Penyembelihan
// Mendukung sapi (default) dan kambing (jika req.body.jenis === 'kambing')
module.exports.sembelih = async (req, res) => {
    try {
        const { idSapi, jenis } = req.body;
        const tipeHewan = jenis === 'kambing' ? 'kambing' : 'sapi';

        const exist = await isHewanExist(tipeHewan, idSapi);
        if (!exist) {
            return res.status(400).json({ message: `${tipeHewan} does not exist` });
        }

        const state = await isHewanState(tipeHewan, idSapi, "Belum Disembelih");
        if (!state) {
            return res.status(400).json({ message: `${tipeHewan} state is prohibited to be set to "Proses Penyembelihan"` });
        }

        if (tipeHewan === 'kambing') {
            await KambingModel.updateKambingState(idSapi, "Proses Penyembelihan");
        } else {
            await SapiModel.updateSapiState(idSapi, "Proses Penyembelihan");
        }

        res.status(200).json({ message: "hewan state updated successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// Revert Sembelih: Proses Penyembelihan -> Belum Disembelih
module.exports.revertSembelih = async (req, res) => {
    try {
        const { idSapi, jenis } = req.body;
        const tipeHewan = jenis === 'kambing' ? 'kambing' : 'sapi';

        const exist = await isHewanExist(tipeHewan, idSapi);
        if (!exist) {
            return res.status(400).json({ message: `${tipeHewan} does not exist` });
        }

        const state = await isHewanState(tipeHewan, idSapi, "Proses Penyembelihan");
        if (!state) {
            return res.status(400).json({ message: `${tipeHewan} state is prohibited to be set to "Belum Disembelih"` });
        }

        if (tipeHewan === 'kambing') {
            await KambingModel.updateKambingState(idSapi, "Belum Disembelih");
        } else {
            await SapiModel.updateSapiState(idSapi, "Belum Disembelih");
        }

        res.status(200).json({ message: "hewan state updated successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
