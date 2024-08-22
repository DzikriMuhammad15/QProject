const bcrypt = require('bcrypt');
const MudhohiModel = require("../models/mudhohiModel");
const UserModel = require("../models/userModel");
const SapiModel = require("../models/sapiModel");
const database = require("../firebaseConfig");


// ! TODO FUNCTION TO HELP 
async function isUsernameAvailable(username) {
    const snapshot = await database.ref('users').orderByChild('username').equalTo(username).once('value');
    return !snapshot.exists();
}

async function isSapiAvailableById(sapiId) {
    const snapshot = await database.ref('sapi').child(sapiId).once('value');
    return !snapshot.exists();
}

async function transformData(data) {
    const result = [];

    // Loop melalui setiap key di object data
    for (const idSapi in data) {
        const sapi = data[idSapi];
        const sapiObj = {
            idSapi: idSapi,
            foto: sapi.foto,
            state: sapi.state,
            mudhohi: []
        };

        // Loop melalui setiap key di dalam object sapi
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

// ! REALISASI
module.exports.getAdminMain = async (req, res) => {
    // TODO ambil res.locals.user dulu untuk mendapatkan current user
    const currentUser = res.locals.user;
    const sapi = await SapiModel.getAllSapi();
    const result = await transformData(sapi);
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    res.render("adminDashboard", { sapi: result, currentUser, firebaseConfig });
}

module.exports.postSapi = async (req, res) => {
    try {
        // TODO ambil request body {foto, noSapi}
        const { foto, noSapi, state } = req.body;
        // TODO validasi noSapi nya (bukan string dan belum ada yang pake)
        if (typeof noSapi == 'number') {
            var available = await isSapiAvailableById(noSapi);
            console.log(available);
            if (available) {
                // TODO buat record sapi(foto, noSapi)
                const sapi = { foto, state };
                await SapiModel.createSapi(sapi, noSapi, state);
                res.status(200).json({ message: "sapi added successfully" });

            }
            else {
                res.status(400).json({ message: "id has already taken" });
            }
        }
        else {
            res.status(400).json({ message: "please enter a valid input" });
        }

    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports.postMudhohi = async (req, res) => {
    try {
        const { name, alamat, noHP, username, password, noSapi } = req.body;
        var tidakAdaSapi = await isSapiAvailableById(noSapi);
        if (tidakAdaSapi) {
            return res.status(400).json({ message: "there's no sapi with that id" })
        }
        var usernameAvailable = await isUsernameAvailable(username);
        if (!usernameAvailable) {
            return res.status(400).json({ message: "username not available" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password length cannot less than 6 charachters" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const mudhohi = { noHP, alamat, noSapi };
        const mudhohiId = await MudhohiModel.createMudhohi(mudhohi);

        const user = { name, username, password: hashedPassword, role: "mudhohi", mudhohiId };
        await UserModel.createUser(user);

        await SapiModel.addMudhohi(noSapi, mudhohiId, false, null, false);
        res.status(200).json({ message: "mudhohi added successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports.postPanitLt1 = async (req, res) => {
    try {
        const { name, username, password } = req.body;
        var usernameAvailable = await isUsernameAvailable(username);
        if (!usernameAvailable) {
            return res.status(400).json({ message: "username not available" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password length cannot less than 6 charachters" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = { name, username, password: hashedPassword, role: "panitLt1" };
        await UserModel.createUser(user);
        res.status(200).json({ message: "panitLt1 added successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports.postPanitLt2 = async (req, res) => {
    try {
        const { name, username, password } = req.body;
        var usernameAvailable = await isUsernameAvailable(username);
        if (!usernameAvailable) {
            return res.status(400).json({ message: "username not available" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password length cannot less than 6 charachters" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = { name, username, password: hashedPassword, role: "panitLt2" };
        await UserModel.createUser(user);
        res.status(200).json({ message: "panitLt2 added successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports.postPanitLt3 = async (req, res) => {
    try {
        const { name, username, password } = req.body;
        var usernameAvailable = await isUsernameAvailable(username);
        if (!usernameAvailable) {
            return res.status(400).json({ message: "username not available" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password length cannot less than 6 charachters" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = { name, username, password: hashedPassword, role: "panitLt3" };
        await UserModel.createUser(user);
        res.status(200).json({ message: "panitLt3 added successfully" });
    }
    catch (err) {
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

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = { name, username, password: hashedPassword, role: "admin" };
        await UserModel.createUser(user);
        res.status(200).json({ message: "admin added successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
