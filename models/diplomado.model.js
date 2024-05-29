const db = require('../util/database');

module.exports = class Diplomado{
    constructor(mi_IDDiplomado,mi_Duracion,mi_precioDiplomado,mi_nombreDiplomado){
        this.IDDiplomado = mi_IDDiplomado;
        this.Duracion = mi_Duracion;
        this.precioDiplomado = mi_precioDiplomado;
        this.nombreDiplomado = mi_nombreDiplomado;
    }

    static save(fechaInicio,fechaFin,precio,nombre) {
        return db.execute(
            `INSERT INTO Diplomado (fechaInicio, fechaFin, precioDiplomado, nombreDiplomado) VALUES ( ?,?,?,?)`, 
                [fechaInicio,fechaFin,precio,nombre]);
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

    static fetchOne(nombre){
        return db.execute('Select * FROM Diplomado WHERE nombreDiplomado = ?',[nombre]);
    }

    static update(id,fechaInicio,fechaFin,precio,nombre){
        return db.execute('UPDATE Diplomado SET fechaInicio=?, fechaFin=?, precioDiplomado=?, nombreDiplomado=? WHERE IDDiplomado=?',
        [fechaInicio,fechaFin,precio,nombre,id]);
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

    static buscar_en_curso(consulta)
    {
        return db.execute('SELECT Diplomado.* FROM Diplomado WHERE nombreDiplomado LIKE ? AND diplomadoActivo = 1 AND IDDiplomado NOT IN (Select IDDiplomado from Cursa WHERE Now() > fechainicio AND Now() < fechafin)', [`%${consulta}%`]
    );
    }

    static fetchDatos(id)
    {
        return db.execute('SELECT Diplomado.* FROM Diplomado WHERE IDDiplomado = ?',
            [id]
        );
    }

    static fetchAlumnos(id){
        return db.execute('SELECT alumno.matricula, alumno.nombre, alumno.apellidos, estudiantediplomado.fechaInscripcion FROM alumno JOIN estudiantediplomado ON alumno.matricula = estudiantediplomado.matricula JOIN cursa ON estudiantediplomado.Matricula = cursa.Matricula JOIN diplomado ON cursa.IDDiplomado = diplomado.IDDiplomado WHERE diplomado.IDDiplomado = ?',
        [id])
    }


};

