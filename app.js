// ! REQUIERE
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');;
// const authRoutes = require("./routers/authRoutes");
// const authMiddlewares = require("./middlewares/authMiddlewares");
// const kelolaAnggotaRoutes = require('./routers/kelolaAnggotaRoutes');
// const kelasRoutes = require("./routers/kelasRoutes");
var cors = require('cors');
// const pembayaranRoutes = require("./routers/pembayaranRoutes")
// const User = require("./models/Pengguna");

require("dotenv").config();

const adminRoutes = require("./routes/adminRoutes");
const panitLt3Routes = require("./routes/panitLt3Routes");
const panitLt2Routes = require("./routes/panitLt2Routes");
const panitLt1Routes = require("./routes/panitLt1Routes");
const mudhohiRoutes = require("./routes/mudhohiRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddlewares = require("./middleware/authMiddlewares");
const adminController = require("./controllers/adminController");


var app = express();

// ! view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());

//! MIDDLEWARE SETUP
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// ! APP LISTEN
app.listen(8080, () => {
    console.log("listening on port 8080...");
})

// ! AUTHCHECK
app.use(authMiddlewares.authCheck);

// ! ROUTE
app.use("/auth", authRoutes);
app.use("/admin", authMiddlewares.protectRoute, authMiddlewares.adminAuthorization, adminRoutes);
app.use("/panitLt3", authMiddlewares.protectRoute, authMiddlewares.panitLt3Authorization, panitLt3Routes);
app.use("/panitLt2", authMiddlewares.protectRoute, authMiddlewares.panitLt2Authorization, panitLt2Routes);
app.use("/panitLt1", authMiddlewares.protectRoute, authMiddlewares.panitLt1Authorization, panitLt1Routes);
app.use("/mudhohi", authMiddlewares.protectRoute, authMiddlewares.mudhohiAuthorization, mudhohiRoutes);
app.post("/createAdmin", adminController.postAdmin);

// pengguna yang belum login

const bcrypt = require('bcrypt');
const MudhohiModel = require("./models/mudhohiModel");
const UserModel = require("./models/userModel");
const SapiModel = require("./models/sapiModel");
const database = require("./firebaseConfig");
const UserCandidateModel = require("./models/userCandidateModel");
const MudhohiCandidateModel = require("./models/mudhohiCandidateModel");

async function isUsernameAvailable(username) {
    const snapshot1 = await database.ref('users').orderByChild('username').equalTo(username).once('value');
    const snapshot2 = await database.ref('userCandidate').orderByChild('username').equalTo(username).once('value');
    return !(snapshot1.exists() || snapshot2.exists());
}

async function isSapiAvailableById(sapiId) {
    const snapshot = await database.ref('sapi').child(sapiId).once('value');
    return !snapshot.exists();
}

app.get("/landingPageRegister", (req, res) => {
    res.render("landingPageRegister");
})

app.get("/", async (req, res) => {
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    console.log(firebaseConfig);
    res.render("mainView", { firebaseConfig });
})
app.post("/postPanitLt1", async (req, res) => {
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
        await UserCandidateModel.createUser(user);
        res.status(200).json({ message: "panitLt1 added successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
})

app.post("/postPanitLt2", async (req, res) => {
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
        await UserCandidateModel.createUser(user);
        res.status(200).json({ message: "panitLt2 added successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
})

app.post("/postPanitLt3", async (req, res) => {
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
        await UserCandidateModel.createUser(user);
        res.status(200).json({ message: "panitLt3 added successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
})

app.post("/postMudhohi", async (req, res) => {
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
        const mudhohiId = await MudhohiCandidateModel.createMudhohi(mudhohi);

        const user = { name, username, password: hashedPassword, role: "mudhohi", mudhohiId };
        await UserCandidateModel.createUser(user);

        res.status(200).json({ message: "mudhohi added successfully" });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
})

// // path lain (else)
// app.use("/", async (req, res) => {
//     res.redirect("/")
// })