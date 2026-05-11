const SapiModel = require("../models/sapiModel");
const KambingModel = require("../models/kambingModel");
const MudhohiModel = require("../models/mudhohiModel");
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
module.exports.getPanitLt2Dashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("panitLt2Dashboard", { currentUser, firebaseConfig: { apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL } });
}

module.exports.setPemrosesanDagingDashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("setPemrosesanDagingDashboard", { currentUser, firebaseConfig: { apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL } });
}

module.exports.revertPemrosesanDagingDashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("revertPemrosesanDagingDashboard", { currentUser, firebaseConfig: { apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL } });
}

module.exports.setReadyDeliverDashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("setReadyDeliverDashboard", { currentUser, firebaseConfig: { apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL } });
}

module.exports.revertReadyDeliverDashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("revertReadyDeliverDashboard", { currentUser, firebaseConfig: { apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL } });
}

// Set Pemrosesan Daging: Proses Penyembelihan -> Pemrosesan Daging
module.exports.pemrosesanDaging = async (req, res) => {
    try {
        const { idSapi, jenis } = req.body;
        const tipeHewan = jenis === 'kambing' ? 'kambing' : 'sapi';

        const exist = await isHewanExist(tipeHewan, idSapi);
        if (!exist) {
            return res.status(400).json({ message: `${tipeHewan} does not exist` });
        }

        const state = await isHewanState(tipeHewan, idSapi, "Proses Penyembelihan");
        if (!state) {
            return res.status(400).json({ message: `${tipeHewan} state is prohibited to be set to "Pemrosesan Daging"` });
        }

        if (tipeHewan === 'kambing') {
            await KambingModel.updateKambingState(idSapi, "Pemrosesan Daging");
        } else {
            await SapiModel.updateSapiState(idSapi, "Pemrosesan Daging");
        }

        res.status(200).json({ message: "hewan state updated successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// Revert Pemrosesan Daging: Pemrosesan Daging -> Proses Penyembelihan
module.exports.revertPemrosesanDaging = async (req, res) => {
    try {
        const { idSapi, jenis } = req.body;
        const tipeHewan = jenis === 'kambing' ? 'kambing' : 'sapi';

        const exist = await isHewanExist(tipeHewan, idSapi);
        if (!exist) {
            return res.status(400).json({ message: `${tipeHewan} does not exist` });
        }

        const state = await isHewanState(tipeHewan, idSapi, "Pemrosesan Daging");
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

// Set Ready Deliver: Pemrosesan Daging -> Siap Dibagikan
module.exports.setReadyDeliver = async (req, res) => {
    try {
        const { idSapi, jenis } = req.body;
        const tipeHewan = jenis === 'kambing' ? 'kambing' : 'sapi';

        const exist = await isHewanExist(tipeHewan, idSapi);
        if (!exist) {
            return res.status(400).json({ message: `${tipeHewan} does not exist` });
        }

        const state = await isHewanState(tipeHewan, idSapi, "Pemrosesan Daging");
        if (!state) {
            return res.status(400).json({ message: `${tipeHewan} state is prohibited to be set to "Siap Dibagikan"` });
        }

        if (tipeHewan === 'kambing') {
            await KambingModel.updateKambingState(idSapi, "Siap Dibagikan");
        } else {
            await SapiModel.updateSapiState(idSapi, "Siap Dibagikan");
        }

        res.status(200).json({ message: "hewan state updated successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// Revert Ready Deliver: Siap Dibagikan -> Pemrosesan Daging
module.exports.revertReadyDeliver = async (req, res) => {
    try {
        const { idSapi, jenis } = req.body;
        const tipeHewan = jenis === 'kambing' ? 'kambing' : 'sapi';

        const exist = await isHewanExist(tipeHewan, idSapi);
        if (!exist) {
            return res.status(400).json({ message: `${tipeHewan} does not exist` });
        }

        const state = await isHewanState(tipeHewan, idSapi, "Siap Dibagikan");
        if (!state) {
            return res.status(400).json({ message: `${tipeHewan} state is prohibited to be set to "Pemrosesan Daging"` });
        }

        if (tipeHewan === 'kambing') {
            await KambingModel.updateKambingState(idSapi, "Pemrosesan Daging");
        } else {
            await SapiModel.updateSapiState(idSapi, "Pemrosesan Daging");
        }

        res.status(200).json({ message: "hewan state updated successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// --- DOWNLOAD EXCEL SNAPSHOT (panitLt2 & admin) ---
// Endpoint ini di-share via adminController.getSnapshotData,
// panitLt2 memanggil endpoint yang sama via route /panitLt2/snapshot
// Agar tidak duplikasi kode, panitLt2 route akan memanggil fungsi yang sama.
// Kita re-export saja fungsi dari adminController.
module.exports.getSnapshotData = require("./adminController").getSnapshotData;
