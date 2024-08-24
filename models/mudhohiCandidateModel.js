// models/mudhohiModel.js
const database = require('../firebaseConfig');

class MudhohiModel {
    static createMudhohi(mudhohi) {
        const mudhohiId = database.ref().child('mudhohiCandidate').push().key;
        database.ref('mudhohiCandidate/' + mudhohiId).set(mudhohi);
        return mudhohiId;
    }

    static getMudhohiById(mudhohiId) {
        return database.ref('mudhohiCandidate/' + mudhohiId).once('value').then(snapshot => snapshot.val());
    }

    static updateMudhohi(mudhohiId, mudhohi) {
        return database.ref('mudhohiCandidate/' + mudhohiId).update(mudhohi);
    }

    static deleteMudhohi(mudhohiId) {
        return database.ref('mudhohiCandidate/' + mudhohiId).remove();
    }

    static getAllMudhohis() {
        return database.ref('mudhohiCandidate').once('value').then(snapshot => snapshot.val());
    }
}

module.exports = MudhohiModel;
