const db = require('../util/database');

module.exports = class estudianteDiplomado {

    constructor(mi_Matricula, mi_fechaInscripcion) {
        this.Matricula = mi_Matricula;
        this.fechaInscripción = mi_fechaInscripcion;
    }

    save(){
        return db.execute(
            `INSERT INTO estudianteDiplomado VALUES (?, ?)`, 
            [this.Matricula, this.fechaInscripción]);
    }

    static fetchDatos(matricula, fechaActual) {
        return db.execute(`SELECT Alumno.Matricula, Alumno.Nombre, Alumno.Apellidos, Alumno.referenciaBancaria, 
        estudianteDiplomado.fechaInscripcion, Diplomado.nombreDiplomado 
        FROM Alumno 
        JOIN estudianteDiplomado on Alumno.Matricula = estudianteDiplomado.Matricula 
        JOIN Cursa on estudianteDiplomado.Matricula = Cursa.Matricula 
        JOIN Diplomado on Cursa.IDDiplomado = Diplomado.IDDiplomado 
        WHERE Alumno.Matricula = ? AND Diplomado.fechaFin > ? AND Diplomado.fechaInicio < ? `, [matricula, fechaActual, fechaActual]);
    }

    static async update(id, ref) {
        return db.execute(`UPDATE Alumno SET referenciaBancaria = ? WHERE matricula = ?`, [ref, id]);
    }
}