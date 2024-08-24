// models/userModel.js
const database = require('../firebaseConfig');
const bcrypt = require('bcrypt');

class UserModel {

    static async login(username, password) {
        try {
            // Cari pengguna berdasarkan username
            const userSnapshot = await database.ref('userCandidate').orderByChild('username').equalTo(username).once('value');
            if (!userSnapshot.exists()) {
                throw new Error('Username atau password salah');
            }

            const userData = userSnapshot.val();
            // TODO mengambil userId dari firebase
            const userId = Object.keys(userData)[0];
            const user = { id: userId, ...userData[userId] };

            // Bandingkan password yang diinput dengan yang ada di database
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Username atau password salah');
            }

            // Kembalikan user jika berhasil login
            return user;
        } catch (error) {
            throw new Error(`Login gagal: ${error.message}`);
        }
    }

    static createUser(user) {
        const userId = database.ref().child('userCandidate').push().key;
        return database.ref('userCandidate/' + userId).set(user);
    }

    static getUserById(userId) {
        return database.ref('userCandidate/' + userId).once('value').then(snapshot => snapshot.val());
    }

    static updateUser(userId, user) {
        return database.ref('userCandidate/' + userId).update(user);
    }

    static deleteUser(userId) {
        return database.ref('userCandidate/' + userId).remove();
    }

    static getAllUsers() {
        return database.ref('userCandidate').once('value').then(snapshot => snapshot.val());
    }


}

module.exports = UserModel;
