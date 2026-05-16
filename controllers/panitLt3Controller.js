const SapiModel = require("../models/sapiModel");
const KambingModel = require("../models/kambingModel");
const database = require("../firebaseConfig");


// ! FUNCTION TO HELP
// Update state sapi atau kambing berdasarkan status mudhohi-nya
async function updateHewanState(jenis, hewanId) {
    const ref = jenis === 'kambing' ? `kambing/${hewanId}` : `sapi/${hewanId}`;
    const hewanRef = database.ref(ref);
    const snapshot = await hewanRef.once('value');

    if (!snapshot.exists()) {
        return;
    }

    const hewanData = snapshot.val();
    let allDeliveredOrPostponed = true;
    let anyDeliveredOrPostponed = false;
    let hasMudhohi = false;

    for (const key in hewanData) {
        // Lewati key bukan-mudhohi (foto, state, dsb yang bukan object)
        if (key === 'foto' || key === 'state' || typeof hewanData[key] !== 'object' || hewanData[key] === null) {
            continue;
        }
        const mudhohi = hewanData[key];
        hasMudhohi = true;
        if (mudhohi.isDelivered || mudhohi.isPostponed) {
            anyDeliveredOrPostponed = true;
        } else {
            allDeliveredOrPostponed = false;
        }
    }

    // Jika tidak ada mudhohi sama sekali, reset allDeliveredOrPostponed
    if (!hasMudhohi) {
        allDeliveredOrPostponed = false;
    }

    let newState;
    if (allDeliveredOrPostponed) {
        newState = "Selesai Dibagikan ke Mudhohi";
    } else if (anyDeliveredOrPostponed) {
        newState = "Sedang Dibagikan ke Mudhohi";
    } else {
        newState = "Siap Dibagikan";
    }

    await hewanRef.child('state').set(newState);
}

async function isHewanSiapDibagikan(jenis, hewanId) {
    const ref = jenis === 'kambing' ? `kambing/${hewanId}/state` : `sapi/${hewanId}/state`;
    const snapshot = await database.ref(ref).once('value');
    if (!snapshot.exists()) return false;
    const state = snapshot.val();
    return state === "Siap Dibagikan" || state === "Sedang Dibagikan ke Mudhohi" || state === "Selesai Dibagikan ke Mudhohi";
}

async function isHewanExist(jenis, hewanId) {
    const ref = jenis === 'kambing' ? 'kambing' : 'sapi';
    const snapshot = await database.ref(ref).child(hewanId).once('value');
    return snapshot.exists();
}


// ! REALISASI
module.exports.getPanitLt3Dashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("panitLt3Dashboard", { currentUser, firebaseConfig: { apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL } });
}

module.exports.changeStatusDashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("changeStatusLt3", { currentUser, firebaseConfig: { apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL } });
}

module.exports.revertDeliverLt3 = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("revertDeliverLt3", { currentUser, firebaseConfig: { apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL } });
}

module.exports.revertPostponeLt3 = async (req, res) => {
    const currentUser = res.locals.user;
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("revertPostponeLt3", { currentUser, firebaseConfig: { apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL } });
}

// Deliver: set isDelivered=true untuk mudhohi pada sapi/kambing
// req.body.jenis: 'kambing' atau 'sapi' (default sapi)
module.exports.deliver = async (req, res) => {
    try {
        const { idSapi, idMudhohi, bukti, jenis } = req.body;
        const tipeHewan = jenis === 'kambing' ? 'kambing' : 'sapi';

        const exist = await isHewanExist(tipeHewan, idSapi);
        if (!exist) {
            return res.status(400).json({ message: `${tipeHewan} does not exist` });
        }

        const siapDibagikan = await isHewanSiapDibagikan(tipeHewan, idSapi);
        if (!siapDibagikan) {
            return res.status(400).json({ message: "Hewan hasn't ready yet to be delivered" });
        }

        if (tipeHewan === 'kambing') {
            await KambingModel.deliver(idSapi, idMudhohi, true, bukti, false, res.locals.user.username);
        } else {
            await SapiModel.deliver(idSapi, idMudhohi, true, bukti, false, res.locals.user.username);
        }

        await updateHewanState(tipeHewan, idSapi);
        res.status(200).json({ message: "data updated successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// Revert Deliver
module.exports.revert = async (req, res) => {
    try {
        const { idSapi, idMudhohi, jenis } = req.body;
        const tipeHewan = jenis === 'kambing' ? 'kambing' : 'sapi';

        if (tipeHewan === 'kambing') {
            await KambingModel.revertDeliver(idSapi, idMudhohi, false, '', false);
        } else {
            await SapiModel.revertDeliver(idSapi, idMudhohi, false, '', false);
        }

        await updateHewanState(tipeHewan, idSapi);
        res.status(200).json({ message: "data updated successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// Postpone: set isPostponed=true untuk mudhohi pada sapi/kambing
module.exports.postpone = async (req, res) => {
    try {
        const { idSapi, idMudhohi, jenis } = req.body;
        const tipeHewan = jenis === 'kambing' ? 'kambing' : 'sapi';

        const exist = await isHewanExist(tipeHewan, idSapi);
        if (!exist) {
            return res.status(400).json({ message: `${tipeHewan} does not exist` });
        }

        const siapDibagikan = await isHewanSiapDibagikan(tipeHewan, idSapi);
        if (!siapDibagikan) {
            return res.status(400).json({ message: "Hewan hasn't ready yet to be delivered" });
        }

        if (tipeHewan === 'kambing') {
            await KambingModel.postpone(idSapi, idMudhohi, false, true, res.locals.user.username);
        } else {
            await SapiModel.postpone(idSapi, idMudhohi, false, true, res.locals.user.username);
        }

        await updateHewanState(tipeHewan, idSapi);
        res.status(200).json({ message: "data updated successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// Revert Postpone
module.exports.revertPostpone = async (req, res) => {
    try {
        const { idSapi, idMudhohi, jenis } = req.body;
        const tipeHewan = jenis === 'kambing' ? 'kambing' : 'sapi';

        const exist = await isHewanExist(tipeHewan, idSapi);
        if (!exist) {
            return res.status(400).json({ message: `${tipeHewan} does not exist` });
        }

        const siapDibagikan = await isHewanSiapDibagikan(tipeHewan, idSapi);
        if (!siapDibagikan) {
            return res.status(400).json({ message: "Hewan hasn't ready yet to be delivered" });
        }

        if (tipeHewan === 'kambing') {
            await KambingModel.revertPostpone(idSapi, idMudhohi, false, '', false);
        } else {
            await SapiModel.revertPostpone(idSapi, idMudhohi, false, '', false);
        }

        await updateHewanState(tipeHewan, idSapi);
        res.status(200).json({ message: "data updated successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}