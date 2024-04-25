const db = require('../util/database');

module.exports = class Contiene {
    constructor(IDCasoUso, IDRol) {
        this.IDCasoUso = IDCasoUso;
        this.IDRol = IDRol;
    }
    static create(rolId, casoUsoId) {
        return db.execute('INSERT INTO Contiene (IDRol, IDCasoUso) VALUES (?, ?)', [rolId, casoUsoId]);
    }
};