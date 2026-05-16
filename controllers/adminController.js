const bcrypt = require('bcrypt');
const MudhohiModel = require("../models/mudhohiModel");
const UserModel = require("../models/userModel");
const SapiModel = require("../models/sapiModel");
const KambingModel = require("../models/kambingModel");
const database = require("../firebaseConfig");
const MudhohiCandidateModel = require("../models/mudhohiCandidateModel");
const UserCandidateModel = require("../models/userCandidateModel");


// ! FUNCTION TO HELP
async function isUsernameAvailable(username) {
    const snapshot = await database.ref('users').orderByChild('username').equalTo(username).once('value');
    return !snapshot.exists();
}

async function isSapiAvailableById(sapiId) {
    const snapshot = await database.ref('sapi').child(sapiId).once('value');
    return !snapshot.exists();
}

async function isKambingAvailableById(kambingId) {
    const snapshot = await database.ref('kambing').child(kambingId).once('value');
    return !snapshot.exists();
}

// Transformasi data sapi (dengan informasi mudhohi)
async function transformData(data) {
    const result = [];
    for (const idSapi in data) {
        const sapi = data[idSapi];
        const sapiObj = {
            idSapi: idSapi,
            jenis: 'sapi',
            foto: sapi.foto,
            state: sapi.state,
            mudhohi: []
        };
        for (const key in sapi) {
            if (key !== 'foto' && key !== 'state' && typeof sapi[key] === 'object') {
                const mudhohiObj = await MudhohiModel.getMudhohiById(key);
                sapiObj.mudhohi.push({ idMudhohi: key, ...mudhohiObj });
            }
        }
        result.push(sapiObj);
    }
    return result;
}

// Transformasi data kambing (dengan informasi mudhohi)
async function transformKambingData(data) {
    const result = [];
    for (const idKambing in data) {
        const kambing = data[idKambing];
        const kambingObj = {
            idKambing: idKambing,
            jenis: 'kambing',
            foto: kambing.foto,
            state: kambing.state,
            mudhohi: []
        };
        for (const key in kambing) {
            if (key !== 'foto' && key !== 'state' && typeof kambing[key] === 'object') {
                const mudhohiObj = await MudhohiModel.getMudhohiById(key);
                kambingObj.mudhohi.push({ idMudhohi: key, ...mudhohiObj });
            }
        }
        result.push(kambingObj);
    }
    return result;
}

// ! REALISASI
module.exports.getAdminMain = async (req, res) => {
    const currentUser = res.locals.user;
    const sapi = await SapiModel.getAllSapi();
    const kambing = await KambingModel.getAllKambing();
    const resultSapi = sapi ? await transformData(sapi) : [];
    const resultKambing = kambing ? await transformKambingData(kambing) : [];
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("AdminDashboard", {
        sapi: resultSapi,
        kambing: resultKambing,
        currentUser,
        firebaseConfig: { apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL }
    });
}

module.exports.getVerifyPanitLt1Dashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const sapi = await SapiModel.getAllSapi();
    const kambing = await KambingModel.getAllKambing();
    const resultSapi = sapi ? await transformData(sapi) : [];
    const resultKambing = kambing ? await transformKambingData(kambing) : [];
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("verifyPanitLt1Dashboard", { sapi: resultSapi, kambing: resultKambing, currentUser, firebaseConfig: { apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL } });
}

module.exports.getVerifyPanitLt2Dashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const sapi = await SapiModel.getAllSapi();
    const kambing = await KambingModel.getAllKambing();
    const resultSapi = sapi ? await transformData(sapi) : [];
    const resultKambing = kambing ? await transformKambingData(kambing) : [];
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("verifyPanitLt2Dashboard", { sapi: resultSapi, kambing: resultKambing, currentUser, firebaseConfig: { apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL } });
}

module.exports.getVerifyPanitLt3Dashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const sapi = await SapiModel.getAllSapi();
    const kambing = await KambingModel.getAllKambing();
    const resultSapi = sapi ? await transformData(sapi) : [];
    const resultKambing = kambing ? await transformKambingData(kambing) : [];
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("verifyPanitLt3Dashboard", { sapi: resultSapi, kambing: resultKambing, currentUser, firebaseConfig: { apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL } });
}

module.exports.getVerifyMudhohiDashboard = async (req, res) => {
    const currentUser = res.locals.user;
    const sapi = await SapiModel.getAllSapi();
    const kambing = await KambingModel.getAllKambing();
    const resultSapi = sapi ? await transformData(sapi) : [];
    const resultKambing = kambing ? await transformKambingData(kambing) : [];
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("verifyMudhohiDashboard", { sapi: resultSapi, kambing: resultKambing, currentUser, firebaseConfig: { apiKey: firebaseConfig.apiKey, authDomain: firebaseConfig.authDomain, projectId: firebaseConfig.projectId, storageBucket: firebaseConfig.storageBucket, messagingSenderId: firebaseConfig.messagingSenderId, appId: firebaseConfig.appId, measurementId: firebaseConfig.measurementId, databaseURL: process.env.DATABASE_URL } });
}


module.exports.postSapi = async (req, res) => {
    try {
        const { foto, noSapi, state } = req.body;
        if (typeof noSapi == 'number') {
            var available = await isSapiAvailableById(noSapi);
            if (available) {
                const sapi = { foto: foto || '', state: state || 'Belum Disembelih' };
                await SapiModel.createSapi(sapi, noSapi);
                res.status(200).json({ message: "sapi added successfully" });
            } else {
                res.status(400).json({ message: "id has already taken" });
            }
        } else {
            res.status(400).json({ message: "please enter a valid input" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// --- KAMBING ---
module.exports.postKambing = async (req, res) => {
    try {
        const { foto, noKambing, state } = req.body;
        if (typeof noKambing == 'number') {
            var available = await isKambingAvailableById(noKambing);
            if (available) {
                const kambing = { foto: foto || '', state: state || 'Belum Disembelih' };
                await KambingModel.createKambing(kambing, noKambing);
                res.status(200).json({ message: "kambing added successfully" });
            } else {
                res.status(400).json({ message: "id has already taken" });
            }
        } else {
            res.status(400).json({ message: "please enter a valid input" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports.postMudhohi = async (req, res) => {
    try {
        const { idMudhohiCandidate, idUserCandidate } = req.body;

        const mudhohiCandidate = await MudhohiCandidateModel.getMudhohiById(idMudhohiCandidate);
        const userCandidate = await UserCandidateModel.getUserById(idUserCandidate);

        if (mudhohiCandidate && userCandidate) {
            const mudhohi = { noHP: mudhohiCandidate.noHP, alamat: mudhohiCandidate.alamat };
            // Support noSapi atau noKambing
            if (mudhohiCandidate.noSapi !== undefined && mudhohiCandidate.noSapi !== null && mudhohiCandidate.noSapi !== '') {
                mudhohi.noSapi = mudhohiCandidate.noSapi;
            }
            if (mudhohiCandidate.noKambing !== undefined && mudhohiCandidate.noKambing !== null && mudhohiCandidate.noKambing !== '') {
                mudhohi.noKambing = mudhohiCandidate.noKambing;
            }

            const mudhohiId = await MudhohiModel.createMudhohi(mudhohi);

            const user = { name: userCandidate.name, username: userCandidate.username, password: userCandidate.password, role: "mudhohi", mudhohiId };
            await UserModel.createUser(user);

            if (mudhohiCandidate.noSapi !== undefined && mudhohiCandidate.noSapi !== null && mudhohiCandidate.noSapi !== '') {
                await SapiModel.addMudhohi(mudhohiCandidate.noSapi, mudhohiId, false, null, false);
            }
            if (mudhohiCandidate.noKambing !== undefined && mudhohiCandidate.noKambing !== null && mudhohiCandidate.noKambing !== '') {
                await KambingModel.addMudhohi(mudhohiCandidate.noKambing, mudhohiId, false, null, false);
            }

            await MudhohiCandidateModel.deleteMudhohi(idMudhohiCandidate);
            await UserCandidateModel.deleteUser(idUserCandidate);

            res.status(200).json({ message: "mudhohi added successfully" });
        } else {
            return res.status(400).json({ message: "there is no mudhohicandidate or usercandidate with that id" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports.postPanitLt1 = async (req, res) => {
    try {
        const { idUserCandidate } = req.body;
        const userCandidate = await UserCandidateModel.getUserById(idUserCandidate);
        if (userCandidate) {
            const user = { name: userCandidate.name, username: userCandidate.username, role: "panitLt1", password: userCandidate.password };
            await UserModel.createUser(user);
            await UserCandidateModel.deleteUser(idUserCandidate);
            res.status(200).json({ message: "panitLt1 added successfully" });
        } else {
            return res.status(400).json({ message: "there is no usercandidate with that id" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports.postPanitLt2 = async (req, res) => {
    try {
        const { idUserCandidate } = req.body;
        const userCandidate = await UserCandidateModel.getUserById(idUserCandidate);
        if (userCandidate) {
            const user = { name: userCandidate.name, username: userCandidate.username, role: "panitLt2", password: userCandidate.password };
            await UserModel.createUser(user);
            await UserCandidateModel.deleteUser(idUserCandidate);
            res.status(200).json({ message: "panitLt2 added successfully" });
        } else {
            return res.status(400).json({ message: "there is no usercandidate with that id" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports.postPanitLt3 = async (req, res) => {
    try {
        const { idUserCandidate } = req.body;
        const userCandidate = await UserCandidateModel.getUserById(idUserCandidate);
        if (userCandidate) {
            const user = { name: userCandidate.name, username: userCandidate.username, role: "panitLt3", password: userCandidate.password };
            await UserModel.createUser(user);
            await UserCandidateModel.deleteUser(idUserCandidate);
            res.status(200).json({ message: "panitLt3 added successfully" });
        } else {
            return res.status(400).json({ message: "there is no usercandidate with that id" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports.postAdmin = async (req, res) => {
    try {
        const { name, username, password } = req.body;
        var usernameAvailable = await isUsernameAvailable(username);
        if (!usernameAvailable) {
            return res.status(400).json({ message: "username not available" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password length cannot less than 6 charachters" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { name, username, password: hashedPassword, role: "admin" };
        await UserModel.createUser(user);
        res.status(200).json({ message: "admin added successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// --- DOWNLOAD EXCEL SNAPSHOT (admin & panitLt2) ---
// Endpoint ini mengembalikan JSON snapshot semua data sapi + kambing + mudhohi
// Gambar dikembalikan sebagai URL string, diproses di sisi client menjadi Excel
module.exports.getSnapshotData = async (req, res) => {
    try {
        const sapiRaw = await SapiModel.getAllSapi();
        const kambingRaw = await KambingModel.getAllKambing();
        const allRows = [];

        // --- Proses data sapi ---
        if (sapiRaw) {
            for (const idSapi in sapiRaw) {
                const sapi = sapiRaw[idSapi];
                let hasMudhohi = false;
                for (const key in sapi) {
                    if (key !== 'foto' && key !== 'state' && typeof sapi[key] === 'object') {
                        hasMudhohi = true;
                        const mudhohiData = sapi[key];
                        const mudhohiObj = await MudhohiModel.getMudhohiById(key);
                        const userSnapshot = await database.ref('users').orderByChild('mudhohiId').equalTo(key).once('value');
                        let namaUser = '';
                        if (userSnapshot.exists()) {
                            const userData = userSnapshot.val();
                            const firstKey = Object.keys(userData)[0];
                            namaUser = userData[firstKey].name || '';
                        }
                        allRows.push({
                            jenis: 'Sapi',
                            noHewan: idSapi,
                            state: sapi.state || '',
                            fotoHewan: sapi.foto || '',
                            idMudhohi: key,
                            namaMudhohi: namaUser,
                            alamat: mudhohiObj ? (mudhohiObj.alamat || '') : '',
                            noHP: mudhohiObj ? (mudhohiObj.noHP || '') : '',
                            isDelivered: mudhohiData.isDelivered ? 'Ya' : 'Tidak',
                            isPostponed: mudhohiData.isPostponed ? 'Ya' : 'Tidak',
                            bukti: mudhohiData.bukti || '',
                            usernamePengirim: mudhohiData.usernamePengirim || ''
                        });
                    }
                }
                if (!hasMudhohi) {
                    allRows.push({
                        jenis: 'Sapi',
                        noHewan: idSapi,
                        state: sapi.state || '',
                        fotoHewan: sapi.foto || '',
                        idMudhohi: '',
                        namaMudhohi: '',
                        alamat: '',
                        noHP: '',
                        isDelivered: '',
                        isPostponed: '',
                        bukti: '',
                        usernamePengirim: ''
                    });
                }
            }
        }

        // --- Proses data kambing ---
        if (kambingRaw) {
            for (const idKambing in kambingRaw) {
                const kambing = kambingRaw[idKambing];
                let hasMudhohi = false;
                for (const key in kambing) {
                    if (key !== 'foto' && key !== 'state' && typeof kambing[key] === 'object') {
                        hasMudhohi = true;
                        const mudhohiData = kambing[key];
                        const mudhohiObj = await MudhohiModel.getMudhohiById(key);
                        const userSnapshot = await database.ref('users').orderByChild('mudhohiId').equalTo(key).once('value');
                        let namaUser = '';
                        if (userSnapshot.exists()) {
                            const userData = userSnapshot.val();
                            const firstKey = Object.keys(userData)[0];
                            namaUser = userData[firstKey].name || '';
                        }
                        allRows.push({
                            jenis: 'Kambing',
                            noHewan: idKambing,
                            state: kambing.state || '',
                            fotoHewan: kambing.foto || '',
                            idMudhohi: key,
                            namaMudhohi: namaUser,
                            alamat: mudhohiObj ? (mudhohiObj.alamat || '') : '',
                            noHP: mudhohiObj ? (mudhohiObj.noHP || '') : '',
                            isDelivered: mudhohiData.isDelivered ? 'Ya' : 'Tidak',
                            isPostponed: mudhohiData.isPostponed ? 'Ya' : 'Tidak',
                            bukti: mudhohiData.bukti || '',
                            usernamePengirim: mudhohiData.usernamePengirim || ''
                        });
                    }
                }
                if (!hasMudhohi) {
                    allRows.push({
                        jenis: 'Kambing',
                        noHewan: idKambing,
                        state: kambing.state || '',
                        fotoHewan: kambing.foto || '',
                        idMudhohi: '',
                        namaMudhohi: '',
                        alamat: '',
                        noHP: '',
                        isDelivered: '',
                        isPostponed: '',
                        bukti: '',
                        usernamePengirim: ''
                    });
                }
            }
        }

        res.status(200).json({ data: allRows });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
