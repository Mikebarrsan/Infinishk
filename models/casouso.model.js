const db = require('../util/database');

module.exports = class CasoUso {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDCasoUso, mi_nombreCasoUso) {
        this.IDCasoUso = mi_IDCasoUso;
        this.nombreCasoUso = mi_nombreCasoUso;
    }

    static fetchAll() {
        return db.execute('SELECT IDCasoUso, funcion AS nombreCasoUso FROM casouso');
    }

    static findByNombre(nombre) {
    return db.execute('SELECT IDCasoUso FROM casouso WHERE funcion = ?', [nombre]);
    }

}

