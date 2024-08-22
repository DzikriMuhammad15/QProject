const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const MudhohiModel = require("../models/mudhohiModel");


// ! MEMBUAT JWT
const maxAge = 4 * 24 * 60 * 60;
const createToken = (idUser, idMudhohi, role) => {
    return jwt.sign({ idUser, idMudhohi, role }, "9cdef41de4e4016adb9d8bascbsaocjbasovbaowq9071291179", { expiresIn: maxAge });
}


// ! ERROR HANDILNG
const handleErrors = (err) => {
    const errorObj = {
        nama: "",
        email: "",
        password: "",
        noTelepon: "",
        alamat: ""
    }

    if (err.message == "Pengguna validation failed: email: Please enter valid email") {
        errorObj.email = "Please enter valid email";
    }

    if (err.code === 11000) {
        errorObj.email = 'that email is already registered';
        return errorObj;
    }
    if (err.message === "incorrect password") {
        errorObj.password = "incorrect password";
    }
    if (err.message === "email not found") {
        errorObj.email = "email not found";
    }
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errorObj[properties.path] = properties.message;
        })
    }

    return errorObj;
}




// ! REALISASI

module.exports.loginGet = (req, res) => {
    res.render("loginPage");
}

module.exports.loginPost = async (req, res) => {
    // TODO ambil dulu masukan email dan password
    const { username, password } = req.body;
    try {
        // TODO panggil fungsi login pada model User
        const user = await UserModel.login(username, password);

        // TODO cek apakah penggunna merupakan admin atau anggota
        if (user.role == "admin") {
            // TODO jika pengguna merupakan admin, bikin jwt untuk admin
            // TODO jika login berhasil, buat jwt, masukkan cookies, kembalikan kembalian user untuk menandai pada view, ubah status menjadi 201 (try)
            const token = createToken(user.id, "", "admin");
            const cookieConfig = { httpOnly: true, maxAge: maxAge * 1000 };
            res.cookie("jwt", token, cookieConfig);
            res.status(201).json({ user: user, token });

        }
        else if (user.role == "mudhohi") {
            // TODO jika pengguna meupakan anggota, tambahkan jwt untuk anggota
            // TODO jika pengguna merupakan admin, bikin jwt untuk admin
            // TODO jika login berhasil, buat jwt, masukkan cookies, kembalikan kembalian user untuk menandai pada view, ubah status menjadi 201 (try)
            const token = createToken(user.id, user.mudhohiId, "mudhohi");
            const cookieConfig = { httpOnly: true, maxAge: maxAge * 1000 };
            res.cookie("jwt", token, cookieConfig);
            const mudhohi = await MudhohiModel.getMudhohiById(user.mudhohiId);
            res.status(201).json({ user: { user, mudhohi }, token });

        }
        else if (user.role == "panitLt1") {
            // TODO jika pengguna meupakan anggota, tambahkan jwt untuk anggota
            // TODO jika pengguna merupakan admin, bikin jwt untuk admin
            // TODO jika login berhasil, buat jwt, masukkan cookies, kembalikan kembalian user untuk menandai pada view, ubah status menjadi 201 (try)
            const token = createToken(user.id, "", "panitLt1");
            const cookieConfig = { httpOnly: true, maxAge: maxAge * 1000 };
            res.cookie("jwt", token, cookieConfig);
            res.status(201).json({ user: user, token });

        }
        else if (user.role == "panitLt2") {
            // TODO jika pengguna meupakan anggota, tambahkan jwt untuk anggota
            // TODO jika pengguna merupakan admin, bikin jwt untuk admin
            // TODO jika login berhasil, buat jwt, masukkan cookies, kembalikan kembalian user untuk menandai pada view, ubah status menjadi 201 (try)
            const token = createToken(user.id, "", "panitLt2");
            const cookieConfig = { httpOnly: true, maxAge: maxAge * 1000 };
            res.cookie("jwt", token, cookieConfig);
            res.status(201).json({ user: user, token });

        }
        else if (user.role == "panitLt3") {
            // TODO jika pengguna meupakan anggota, tambahkan jwt untuk anggota
            // TODO jika pengguna merupakan admin, bikin jwt untuk admin
            // TODO jika login berhasil, buat jwt, masukkan cookies, kembalikan kembalian user untuk menandai pada view, ubah status menjadi 201 (try)
            const token = createToken(user.id, "", "panitLt3");
            const cookieConfig = { httpOnly: true, maxAge: maxAge * 1000 };
            res.cookie("jwt", token, cookieConfig);
            res.status(201).json({ user: user, token });

        }
    }
    catch (err) {
        // TODO jika login gagal, lakukan handling error, kembalikan error ke depan, ubah status menjadi 400
        res.status(400).json({ message: err.message });
    }
}

module.exports.logoutGet = (req, res) => {
    // TODO hapus dulu cookienya
    res.clearCookie("jwt");
    // TODO redirect ke home
    res.redirect("/");
}
