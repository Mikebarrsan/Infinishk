const db = require('../util/database');

module.exports = class Alumno {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_Matricula,mi_Nombre,mi_Apellidos,mi_referenciaBancaria){
        this.Matricula = mi_Matricula;
        this.Nombre = mi_Nombre;
        this.Apellidos = mi_Apellidos;
        this.referenciaBancaria = mi_referenciaBancaria;
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

    static fetchHorarioConfirmado(matricula){
        return db.execute(`SELECT horarioConfirmado FROM Alumno WHERE Matricula = ?`, [matricula]);
    }

    static fetchCredito(matricula){
        return db.execute(`SELECT Credito FROM Alumno WHERE Matricula = ?`, [matricula])
    }

    static fetchBeca(matricula){
        return db.execute(`SELECT 
        CASE 
            WHEN porcBeca > 0 THEN (1 - (porcBeca / 100)) 
            ELSE 1 
        END AS beca
        FROM estudianteprofesional 
        WHERE Matricula = ?`, [matricula])
    }

}