const db = require('../util/database');

module.exports = class Diplomado {
    constructor(mi_IDDiplomado, mi_precioDiplomado, mi_nombreDiplomado, mi_fechaInicio, mi_fechaFin) {
        this.IDDiplomado = mi_IDDiplomado;
        this.precioDiplomado = mi_precioDiplomado;
        this.nombreDiplomado = mi_nombreDiplomado;
        this.fechaInicio = mi_fechaInicio;
        this.fechaFin = mi_fechaFin;
    }

    static save(fechaInicio, fechaFin, precio, nombre) {
        return db.execute(
            `INSERT INTO Diplomado (fechaInicio, fechaFin, precioDiplomado, nombreDiplomado) VALUES ( ?,?,?,?)`,
            [fechaInicio, fechaFin, precio, nombre]);
    }

    static fetchAllActives() {
        return db.execute('SELECT * FROM Diplomado WHERE fechaFin >= now()')
    }

    static fetchAllNoActives() {
        return db.execute('SELECT * FROM Diplomado WHERE fechaFin <= now()')
    }

    static fetchAllInProgress() {
        return db.execute('SELECT * FROM Diplomado WHERE diplomadoActivo = 1 AND IDDiplomado IN (SELECT IDDiplomado FROM Cursa WHERE Now() > fechainicio AND Now() < fechafin)')
    }

    static fetchOne(nombre) {
        return db.execute('Select * FROM Diplomado WHERE nombreDiplomado = ?', [nombre]);
    }

    static fetchID(nombre) {
        return db.execute('Select IDDiplomado FROM diplomado WHERE nombreDiplomado = ?', [nombre]);
    }

    static update(id, fechaInicio, fechaFin, precio, nombre) {
        return db.execute('UPDATE Diplomado SET fechaInicio=?, fechaFin=?, precioDiplomado=?, nombreDiplomado=? WHERE IDDiplomado=?',
            [fechaInicio, fechaFin, precio, nombre, id]);
    }

    static buscar(consulta) {
        return db.execute(
            'SELECT Diplomado.* FROM Diplomado LEFT JOIN Cursa ON Diplomado.idDiplomado = cursa.idDiplomado WHERE cursa.idDiplomado IS NULL AND nombreDiplomado LIKE ? AND diplomadoActivo = 1;',
            [`%${consulta}%`]
        );
    }

    static buscar_noactivo(consulta) {
        return db.execute(
            'SELECT Diplomado.* FROM Diplomado WHERE nombreDiplomado LIKE ? AND diplomadoActivo = 0;',
            [`%${consulta}%`]
        );
    }

    static buscar_en_curso(consulta) {
        return db.execute('SELECT Diplomado.* FROM Diplomado WHERE nombreDiplomado LIKE ? AND diplomadoActivo = 1 AND IDDiplomado NOT IN (Select IDDiplomado from Cursa WHERE Now() > fechainicio AND Now() < fechafin)', [`%${consulta}%`]
        );
    }

    static fetchDatos(id) {
        return db.execute('SELECT Diplomado.* FROM Diplomado WHERE IDDiplomado = ?',
            [id]
        );
    }

    static fetchAlumnos(id) {
        return db.execute('SELECT alumno.matricula, alumno.nombre, alumno.apellidos, estudiantediplomado.fechaInscripcion FROM alumno JOIN estudiantediplomado ON alumno.matricula = estudiantediplomado.matricula JOIN cursa ON estudiantediplomado.Matricula = cursa.Matricula JOIN diplomado ON cursa.IDDiplomado = diplomado.IDDiplomado WHERE diplomado.IDDiplomado = ?',
            [id])
    }

    static fetchAlumnosNoinscritos(nombre) {
        return db.execute('SELECT estudiantediplomado.matricula, alumno.nombre, alumno.apellidos, estudiantediplomado.fechaInscripcion FROM estudiantediplomado JOIN alumno ON estudiantediplomado.matricula = alumno.matricula WHERE estudiantediplomado.matricula NOT IN (SELECT cursa.Matricula FROM cursa JOIN diplomado ON cursa.IDDiplomado = diplomado.IDDiplomado WHERE diplomado.nombreDiplomado= ?)',
            [nombre])
    }

    static insertarAlumno(matricula, id) {
        return db.execute('INSERT INTO `cursa`(`Matricula`, `IDDiplomado`) VALUES (?,?)',
            [matricula, id])
    }

};

