const SapiModel = require("../models/sapiModel");
const database = require("../firebaseConfig");


// ! FUNCTION TO HELP
async function updateSapiState(sapiId) {
    const sapiRef = database.ref(`sapi/${sapiId}`);
    const snapshot = await sapiRef.once('value');

    if (!snapshot.exists()) {
        console.log('Sapi tidak ditemukan');
        return;
    }

    const sapiData = snapshot.val();

    let allDeliveredOrPostponed = true;
    let anyDeliveredOrPostponed = false;

    // Loop through each child of sapiId
    for (const key in sapiData) {
        const mudhohi = sapiData[key];

        // Only consider nodes that have 'isDelivered' or 'isPostponed' attribute
        if (mudhohi.hasOwnProperty('isDelivered') || mudhohi.hasOwnProperty('isPostponed')) {
            console.log(`isDelivered for mudhohi ${key}:`, mudhohi.isDelivered);
            console.log(`isPostponed for mudhohi ${key}:`, mudhohi.isPostponed);

            if (mudhohi.isDelivered || mudhohi.isPostponed) {
                anyDeliveredOrPostponed = true;
            } else {
                allDeliveredOrPostponed = false;
            }
        }
    }

    console.log(`allDeliveredOrPostponed: ${allDeliveredOrPostponed}, anyDeliveredOrPostponed: ${anyDeliveredOrPostponed}`);

    let newState;
    if (allDeliveredOrPostponed) {
        newState = "Selesai Dibagikan ke Mudhohi";
    } else if (anyDeliveredOrPostponed) {
        newState = "Sedang Dibagikan ke Mudhohi";
    } else {
        newState = "Siap Dibagikan";
    }

    console.log(`Updating state to: ${newState}`);

    await sapiRef.child('state').set(newState);
    console.log(`State sapi dengan ID ${sapiId} diperbarui menjadi: ${newState}`);
}


async function isSapiSiapDibagikan(sapiId) {
    const sapiRef = database.ref(`sapi/${sapiId}/state`);
    const snapshot = await sapiRef.once('value');

    if (!snapshot.exists()) {
        console.log('State tidak ditemukan');
        return false; // Atau mungkin return null/undefined sesuai kebutuhanmu
    }

    const state = snapshot.val();

    return state === "Siap Dibagikan" || state === "Sedang Dibagikan ke Mudhohi" || state === "Selesai Dibagikan ke Mudhohi";
}

async function isSapiExist(sapiId) {
    const snapshot = await database.ref('sapi').child(sapiId).once('value');
    return snapshot.exists();
}




// ! REALISASI
module.exports.getPanitLt3Dashboard = async (req, res) => {
    const currentUser = res.locals.user;
    // console.log({ role: "panitLt3", currentUser });
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("panitLt3Dashboard", { currentUser, firebaseConfig })
}


module.exports.changeStatusDashboard = async (req, res) => {
    const currentUser = res.locals.user;
    // console.log({ role: "panitLt3", currentUser });
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("changeStatusLt3", { currentUser, firebaseConfig })
}

module.exports.revertDeliverLt3 = async (req, res) => {
    const currentUser = res.locals.user;
    // console.log({ role: "panitLt3", currentUser });
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("revertDeliverLt3", { currentUser, firebaseConfig })
}

module.exports.revertPostponeLt3 = async (req, res) => {
    const currentUser = res.locals.user;
    // console.log({ role: "panitLt3", currentUser });
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("revertPostponeLt3", { currentUser, firebaseConfig })
}

module.exports.deliver = async (req, res) => {
    try {
        // TODO ambil parameter (idSapi, idMudhohi)
        const { idSapi, idMudhohi, bukti } = req.body;
        // TODO cek apakah sapi dengan id tertentu ada
        const exist = await isSapiExist(idSapi);
        if (!exist) {
            return res.status(400).json({ message: "sapi does not exist" });
        }
        // TODO cek apakah sapi siap dibagikan
        const siapDibagikan = await isSapiSiapDibagikan(idSapi);
        if (!siapDibagikan) {
            return res.status(400).json({ message: "Sapi hasn't ready yet to delivered" });
        }
        // TODO ganti nilai isDelivered dan bukti
        await SapiModel.deliver(idSapi, idMudhohi, true, bukti, false, res.locals.user.username);
        // TODO update nilai state sapi
        await updateSapiState(idSapi);
        res.status(200).json({ message: "data updated successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports.revert = async (req, res) => {
    try {

        // TODO ambil parameter (idSapi, idMudhohi)
        const { idSapi, idMudhohi } = req.body;
        // TODO dapatkan gambar dan ubah menjadi string (nanti)
        // TODO ganti nilai isDelivered dan bukti
        await SapiModel.revertDeliver(idSapi, idMudhohi, false, "", false);
        // TODO update nilai state sapi
        await updateSapiState(idSapi);
        res.status(200).json({ message: "data updated successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports.postpone = async (req, res) => {
    try {
        // TODO ambil parameter (idSapi, idMudhohi)
        const { idSapi, idMudhohi } = req.body;
        // TODO cek apakah sapi dengan id tertentu ada
        const exist = await isSapiExist(idSapi);
        if (!exist) {
            return res.status(400).json({ message: "sapi does not exist" });
        }
        // TODO cek apakah sapi siap dibagikan
        const siapDibagikan = await isSapiSiapDibagikan(idSapi);
        if (!siapDibagikan) {
            return res.status(400).json({ message: "Sapi hasn't ready yet to delivered" });
        }
        // TODO postpone
        await SapiModel.postpone(idSapi, idMudhohi, false, true, res.locals.user.username);
        // TODO update nilai state sapi
        await updateSapiState(idSapi);
        res.status(200).json({ message: "data updated successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports.revertPostpone = async (req, res) => {
    try {
        // TODO ambil parameter (idSapi, idMudhohi)
        const { idSapi, idMudhohi } = req.body;
        // TODO cek apakah sapi dengan id tertentu ada
        const exist = await isSapiExist(idSapi);
        if (!exist) {
            return res.status(400).json({ message: "sapi does not exist" });
        }
        // TODO cek apakah sapi siap dibagikan
        const siapDibagikan = await isSapiSiapDibagikan(idSapi);
        if (!siapDibagikan) {
            return res.status(400).json({ message: "Sapi hasn't ready yet to delivered" });
        }
        // TODO revert postpone
        await SapiModel.revertPostpone(idSapi, idMudhohi, false, "", false);
        // TODO update nilai state sapi
        await updateSapiState(idSapi);
        res.status(200).json({ message: "data updated successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }

}