const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const MudhohiModel = require("../models/mudhohiModel");
const database = require("../firebaseConfig");

// ! FUNCTION TO HELP
async function isUserExist(userId) {
    console.log('User ID:', userId); // Tambahkan log untuk melihat nilai userId
    if (!userId) {
        throw new Error('Invalid userId');
    }
    const snapshot = await database.ref('users').child(userId).once('value');
    return snapshot.exists();
}





// auth check -> function yang dijalankan saat membuka web -> untuk mengisi nilai res.loclas (kalau belum login, maka nilali res.loclas nya kosong (tidak ada))
module.exports.authCheck = (req, res, next) => {
    // TODO ambil token dari cookies
    const token = req.cookies['jwt'];
    // TODO cek keberadaan token
    if (token) {
        // TODO  ada jika: 
        // TODO cek verifikasi token
        jwt.verify(token, "9cdef41de4e4016adb9d8bascbsaocjbasovbaowq9071291179", async (err, decodedToken) => {
            if (!err) {
                // TODO jika terferifikasi : 
                // TODO cek apakah dia merupakan admin atau mudhohi atau panitLt1 atau panitLt2 atau panitLt3
                if (decodedToken.role == "admin") {
                    // TODO jika dia merupakan admin, set local pengguna sebagai pengguna dan local role sebagai obj kosong
                    const user = await UserModel.getUserById(decodedToken.idUser);
                    res.locals.user = user;
                    res.locals.mudhohi = {};
                    next();
                }
                else if (decodedToken.role == "mudhohi") {
                    // TODO jika dia merupakan admin, set local pengguna sebagai pengguna dan local role sebagai obj kosong
                    const user = await UserModel.getUserById(decodedToken.idUser);
                    res.locals.user = user;
                    const mudhohi = await MudhohiModel.getMudhohiById(decodedToken.idMudhohi);
                    res.locals.mudhohi = mudhohi;
                    next();
                }
                else if (decodedToken.role == "panitLt1") {
                    // TODO jika dia merupakan panitLt1, set local pengguna sebagai pengguna dan local role sebagai obj kosong
                    const user = await UserModel.getUserById(decodedToken.idUser);
                    res.locals.user = user;
                    res.locals.mudhohi = {};
                    next();
                }
                else if (decodedToken.role == "panitLt2") {
                    // TODO jika dia merupakan panitLt2, set local pengguna sebagai pengguna dan local role sebagai obj kosong
                    const user = await UserModel.getUserById(decodedToken.idUser);
                    res.locals.user = user;
                    res.locals.mudhohi = {};
                    next();
                }
                else {
                    // panitlt3
                    // TODO jika dia merupakan panitLt3, set local pengguna sebagai pengguna dan local role sebagai obj kosong
                    const user = await UserModel.getUserById(decodedToken.idUser);
                    res.locals.user = user;
                    res.locals.mudhohi = {};
                    next();
                }
            }
            else {
                // TODO jika tidak terverifikasi
                // TODO ubah res.locals.user menjadi null kemudian next
                res.locals.user = null;
                res.locals.mudhohi = null;
                next();
            }
        })
    }
    else {
        // TODO jika tidak ada : 
        // TODO ubah res.locals.user menjadi null kemudian next
        res.locals.user = null;
        res.locals.mudhohi = null;
        next();
    }
}

// protect route -> melinudngi route yang hanya dapat diakses pengguna yang login (admin, mudhohi, panitLt1, panitLt2, panitLt3)
module.exports.protectRoute = (req, res, next) => {
    // TODO ambil token dari cookies
    const token = req.cookies['jwt'];
    // TODO cek jwtnya ada ato enggak
    if (jwt) {
        //cek apaka masuk
        // TODO kalo ada, cek apakah terverifikasi
        jwt.verify(token, "9cdef41de4e4016adb9d8bascbsaocjbasovbaowq9071291179", async (err, decodedToken) => {
            if (!err) {
                // TODO kalo terverifikasi, cek apakah ada di database atau tidak
                const idUser = decodedToken.idUser;
                const userExist = await isUserExist(idUser);
                if (userExist) {
                    // TODO kalo ada, next
                    next();
                }
                else {
                    // TODo kalo tidak balikin ke login
                    res.redirect("/")
                }
            } else {
                // TODO kalo tidak terverifikasi, balikin ke login
                res.redirect("/")
            }
        })

    }
    else {
        // TODO kalo tidak ada, balikin ke login
        res.redirect("/")
    }
}

module.exports.adminAuthorization = (req, res, next) => {
    // TODO ambil dulu tokennya, dan lakukan decode terhadap tokennya
    const token = req.cookies['jwt'];
    if (token) {
        jwt.verify(token, "9cdef41de4e4016adb9d8bascbsaocjbasovbaowq9071291179", async (err, decodedToken) => {
            // TODO ambil id usernya
            const idUser = decodedToken.idUser;
            // TODO cek apakah id tersebut terdapat di database
            const found = await UserModel.getUserById(idUser);
            if (found) {
                // TODO jika id tersebut terdapat di database, cek apakah dia merupakan admin
                const role = found.role;
                if (role == "admin") {
                    // TODO jika rolenya admin, next
                    next();
                }
                else {
                    // TODO jika rolenya bukan admin, kembalikan not authorized (status 401)
                    res.status(401).json({ message: "not authorized" });
                }

            }
            else {
                // TODO jika admin tidak ditemukan kembalikan not authenticated (status 401)
                res.redirect("/")
            }
        })
    }
    else {
        res.redirect("/")
    }
}

module.exports.mudhohiAuthorization = (req, res, next) => {
    // TODO ambil dulu tokennya, dan lakukan decode terhadap tokennya
    const token = req.cookies['jwt'];
    if (token) {
        jwt.verify(token, "9cdef41de4e4016adb9d8bascbsaocjbasovbaowq9071291179", async (err, decodedToken) => {
            // TODO ambil id usernya
            const idUser = decodedToken.idUser;
            // TODO cek apakah id tersebut terdapat di database
            const found = await UserModel.getUserById(idUser);
            if (found) {
                // TODO jika id tersebut terdapat di database, cek apakah dia merupakan mudhohi atau admin
                const role = found.role;
                if (role == "admin" || role == "mudhohi") {
                    // TODO jika rolenya admin, next
                    next();
                }
                else {
                    // TODO jika rolenya bukan admin, kembalikan not authorized (status 401)
                    res.status(401).json({ message: "not authorized" });
                }

            }
            else {
                // TODO jika admin tidak ditemukan kembalikan not authenticated (status 401)
                res.redirect("/")
            }
        })
    }
    else {
        res.redirect("/")
    }
}

module.exports.panitLt1Authorization = (req, res, next) => {
    // TODO ambil dulu tokennya, dan lakukan decode terhadap tokennya
    const token = req.cookies['jwt'];
    if (token) {
        jwt.verify(token, "9cdef41de4e4016adb9d8bascbsaocjbasovbaowq9071291179", async (err, decodedToken) => {
            // TODO ambil id usernya
            const idUser = decodedToken.idUser;
            // TODO cek apakah id tersebut terdapat di database
            const found = await UserModel.getUserById(idUser);
            if (found) {
                // TODO jika id tersebut terdapat di database, cek apakah dia merupakan panitLt1
                const role = found.role;
                if (role == "admin" || role == "panitLt1") {
                    // TODO jika rolenya admin, next
                    next();
                }
                else {
                    // TODO jika rolenya bukan admin, kembalikan not authorized (status 401)
                    res.status(401).json({ message: "not authorized" });
                }

            }
            else {
                // TODO jika admin tidak ditemukan kembalikan not authenticated (status 401)
                res.redirect("/")
            }
        })
    }
    else {
        res.redirect("/")
    }
}

module.exports.panitLt2Authorization = (req, res, next) => {
    // TODO ambil dulu tokennya, dan lakukan decode terhadap tokennya
    const token = req.cookies['jwt'];
    if (token) {
        jwt.verify(token, "9cdef41de4e4016adb9d8bascbsaocjbasovbaowq9071291179", async (err, decodedToken) => {
            // TODO ambil id usernya
            const idUser = decodedToken.idUser;
            // TODO cek apakah id tersebut terdapat di database
            const found = await UserModel.getUserById(idUser);
            if (found) {
                // TODO jika id tersebut terdapat di database, cek apakah dia merupakan panitLt2
                const role = found.role;
                if (role == "admin" || role == "panitLt2") {
                    // TODO jika rolenya admin, next
                    next();
                }
                else {
                    // TODO jika rolenya bukan admin, kembalikan not authorized (status 401)
                    res.status(401).json({ message: "not authorized" });
                }

            }
            else {
                // TODO jika admin tidak ditemukan kembalikan not authenticated (status 401)
                res.redirect("/")
            }
        })
    }
    else {
        res.redirect("/")
    }
}

module.exports.panitLt3Authorization = (req, res, next) => {
    // TODO ambil dulu tokennya, dan lakukan decode terhadap tokennya
    const token = req.cookies['jwt'];
    if (token) {
        jwt.verify(token, "9cdef41de4e4016adb9d8bascbsaocjbasovbaowq9071291179", async (err, decodedToken) => {
            // TODO ambil id usernya
            const idUser = decodedToken.idUser;
            // TODO cek apakah id tersebut terdapat di database
            const found = await UserModel.getUserById(idUser);
            if (found) {
                // TODO jika id tersebut terdapat di database, cek apakah dia merupakan panitLt3
                const role = found.role;
                if (role == "admin" || role == "panitLt3") {
                    // TODO jika rolenya admin, next
                    next();
                }
                else {
                    // TODO jika rolenya bukan admin, kembalikan not authorized (status 401)
                    res.status(401).json({ message: "not authorized" });
                }

            }
            else {
                // TODO jika admin tidak ditemukan kembalikan not authenticated (status 401)
                res.redirect("/")
            }
        })
    }
    else {
        res.redirect("/")
    }
}