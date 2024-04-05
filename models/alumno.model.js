const db = require('../util/database');

module.exports = class Alumno {
    constructor() {

    }

    static fetch(valor_busqueda){
        return db.execute(`SELECT Matricula, Nombre, Apellidos FROM Alumno
         WHERE CONCAT_WS(' ', Nombre, Apellidos) LIKE ? OR Matricula LIKE ? `, ['%' + valor_busqueda + '%', '%' + valor_busqueda + '%']);
    }

    static fetch_both(matricula, nombre) {
        return db.execute(`SELECT Matricula, Nombre, Apellidos FROM Alumno
         WHERE CONCAT_WS(' ', Nombre, Apellidos) LIKE ? AND Matricula LIKE ? `, ['%' + nombre + '%', '%' + matricula + '%']);
    }

    static fetchOne(matricula){
        return db.execute(`SELECT Matricula, Nombre, Apellidos 
        FROM Alumno WHERE Matricula = ?`, [matricula]);
    }

};