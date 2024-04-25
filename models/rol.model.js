const db = require('../util/database');

module.exports = class Rol {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDRol, mi_nombreRol) {
        this.IDRol = mi_IDRol;
        this.nombreRol = mi_nombreRol;

    }
    static create(nombreRol) {
        return db.execute('INSERT INTO Rol (nombreRol) VALUES (?)', [nombreRol]);
    }
}