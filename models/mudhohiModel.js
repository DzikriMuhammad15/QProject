// models/mudhohiModel.js
const database = require('../firebaseConfig');

class MudhohiModel {
    static createMudhohi(mudhohi) {
        const mudhohiId = database.ref().child('mudhohis').push().key;
        database.ref('mudhohis/' + mudhohiId).set(mudhohi);
        return mudhohiId;
    }

    static getMudhohiById(mudhohiId) {
        return database.ref('mudhohis/' + mudhohiId).once('value').then(snapshot => snapshot.val());
    }

    static updateMudhohi(mudhohiId, mudhohi) {
        return database.ref('mudhohis/' + mudhohiId).update(mudhohi);
    }

    static deleteMudhohi(mudhohiId) {
        return database.ref('mudhohis/' + mudhohiId).remove();
    }

    static getAllMudhohis() {
        return database.ref('mudhohis').once('value').then(snapshot => snapshot.val());
    }
}

module.exports = MudhohiModel;
