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
app.get("/", async (req, res) => {
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    console.log(firebaseConfig);
    res.render("mainView", { firebaseConfig });
})

// // path lain (else)
// app.use("/", async (req, res) => {
//     res.redirect("/")
// })