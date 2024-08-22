// models/sapiModel.js
const database = require('../firebaseConfig');

class SapiModel {
    // Menambahkan data sapi baru ke dalam database
    static createSapi(sapi, noSapi) {
        return database.ref('sapi/' + noSapi).set(sapi);
    }

    // Mengambil data sapi berdasarkan ID-nya
    static getSapiById(sapiId) {
        return database.ref('sapi/' + sapiId).once('value').then(snapshot => snapshot.val());
    }

    // Memperbarui data sapi berdasarkan ID-nya
    static updateSapi(sapiId, sapi) {
        return database.ref('sapi/' + sapiId).update(sapi);
    }

    // Menghapus data sapi berdasarkan ID-nya
    static deleteSapi(sapiId) {
        return database.ref('sapi/' + sapiId).remove();
    }

    // Mengambil semua data sapi
    static getAllSapi() {
        return database.ref('sapi').once('value').then(snapshot => snapshot.val());
    }

    // menambahkan mudhohi dalam data sapi
    static addMudhohi(noSapi, mudhohi, isDelivered, bukti, isPostponed) {
        const val = { isDelivered, bukti, isPostponed };
        return database.ref('sapi/' + noSapi + "/" + mudhohi).set(val);
    }

    // mengubah nilai isDelivered dan bukti
    static deliver(noSapi, mudhohi, isDelivered, bukti, isPostponed, usernamePengirim) {
        const val = { isDelivered, bukti, isPostponed, usernamePengirim };
        return database.ref('sapi/' + noSapi + "/" + mudhohi).set(val);
    }
    static revertDeliver(noSapi, mudhohi, isDelivered, bukti, isPostponed) {
        const val = { isDelivered, bukti, isPostponed };
        return database.ref('sapi/' + noSapi + "/" + mudhohi).set(val);
    }
    // mengubah nilai isPostponed
    static postpone(noSapi, mudhohi, isDelivered, isPostponed, usernamePengirim) {
        const val = { isDelivered, isPostponed, usernamePengirim };
        return database.ref('sapi/' + noSapi + "/" + mudhohi).set(val);
    }

    static revertPostpone(noSapi, mudhohi, isDelivered, bukti, isPostponed) {
        const val = { isDelivered, bukti, isPostponed };
        return database.ref('sapi/' + noSapi + "/" + mudhohi).set(val);
    }

    // mengubah state dari sapi
    static updateSapiState(sapiId, newState) {
        const sapiRef = database.ref(`sapi/${sapiId}/state`);
        return sapiRef.set(newState);
    }
}

module.exports = SapiModel;
