// models/kambingModel.js
const database = require('../firebaseConfig');

class KambingModel {
    // Menambahkan data kambing baru ke dalam database
    static createKambing(kambing, noKambing) {
        return database.ref('kambing/' + noKambing).set(kambing);
    }

    // Mengambil data kambing berdasarkan ID-nya
    static getKambingById(kambingId) {
        return database.ref('kambing/' + kambingId).once('value').then(snapshot => snapshot.val());
    }

    // Memperbarui data kambing berdasarkan ID-nya
    static updateKambing(kambingId, kambing) {
        return database.ref('kambing/' + kambingId).update(kambing);
    }

    // Menghapus data kambing berdasarkan ID-nya
    static deleteKambing(kambingId) {
        return database.ref('kambing/' + kambingId).remove();
    }

    // Mengambil semua data kambing
    static getAllKambing() {
        return database.ref('kambing').once('value').then(snapshot => snapshot.val());
    }

    // Menambahkan mudhohi dalam data kambing
    static addMudhohi(noKambing, mudhohi, isDelivered, bukti, isPostponed) {
        const val = { isDelivered, bukti, isPostponed };
        return database.ref('kambing/' + noKambing + '/' + mudhohi).set(val);
    }

    // Mengubah nilai isDelivered dan bukti
    static deliver(noKambing, mudhohi, isDelivered, bukti, isPostponed, usernamePengirim) {
        const val = { isDelivered, bukti, isPostponed, usernamePengirim };
        return database.ref('kambing/' + noKambing + '/' + mudhohi).set(val);
    }

    static revertDeliver(noKambing, mudhohi, isDelivered, bukti, isPostponed) {
        const val = { isDelivered, bukti, isPostponed };
        return database.ref('kambing/' + noKambing + '/' + mudhohi).set(val);
    }

    // Mengubah nilai isPostponed
    static postpone(noKambing, mudhohi, isDelivered, isPostponed, usernamePengirim) {
        const val = { isDelivered, isPostponed, usernamePengirim };
        return database.ref('kambing/' + noKambing + '/' + mudhohi).set(val);
    }

    static revertPostpone(noKambing, mudhohi, isDelivered, bukti, isPostponed) {
        const val = { isDelivered, bukti, isPostponed };
        return database.ref('kambing/' + noKambing + '/' + mudhohi).set(val);
    }

    // Mengubah state dari kambing
    static updateKambingState(kambingId, newState) {
        const kambingRef = database.ref(`kambing/${kambingId}/state`);
        return kambingRef.set(newState);
    }
}

module.exports = KambingModel;
