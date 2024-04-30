const db = require('../util/database');

module.exports = class Alumno {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_Matricula, mi_Nombre, mi_Apellidos, mi_referenciaBancaria) {
        this.Matricula = mi_Matricula;
        this.Nombre = mi_Nombre;
        this.Apellidos = mi_Apellidos;
        this.referenciaBancaria = mi_referenciaBancaria;
    }

    static fetchNombre(matricula) {
        return db.execute('SELECT Nombre,Apellidos FROM alumno WHERE Matricula = ?',
            [matricula]);
    }

    static fetch(valor_busqueda) {
        return db.execute(`SELECT Matricula, Nombre, Apellidos FROM Alumno
         WHERE CONCAT_WS(' ', Nombre, Apellidos) LIKE ? OR Matricula LIKE ? `, ['%' + valor_busqueda + '%', '%' + valor_busqueda + '%']);
    }

    static fetch_both(matricula, nombre) {
        return db.execute(`SELECT Matricula, Nombre, Apellidos FROM Alumno
         WHERE CONCAT_WS(' ', Nombre, Apellidos) LIKE ? AND Matricula LIKE ? `, ['%' + nombre + '%', '%' + matricula + '%']);
    }

    static fetchOne(matricula) {
        return db.execute(`SELECT Matricula, Nombre, Apellidos
        FROM Alumno WHERE Matricula = ?`, [matricula]);
    }

    static update_credito(matricula, credito) {
        return db.execute(`UPDATE Alumno SET Credito = Credito + ?
        WHERE Matricula = ?`, [credito, matricula]);
    }

    static fetchHorarioConfirmado(matricula){
        return db.execute(`SELECT horarioConfirmado FROM Alumno WHERE Matricula = ?`, [matricula]);
    }

    static updateHorarioAccepted(matricula){
        return db.execute(`UPDATE Alumno SET horarioConfirmado = 1 WHERE Matricula = ?`, [matricula]);
    }

    static fetchCredito(matricula){
        return db.execute(`SELECT CAST(credito AS CHAR(20)) FROM alumno WHERE Matricula = ?`,[matricula]);
    }
}
