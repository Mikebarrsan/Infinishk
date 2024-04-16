const db = require('../util/database');

module.exports = class Diplomado{
    constructor(mi_IDDiplomado,mi_Duracion,mi_precioDiplomado,mi_nombreDiplomado){
        this.IDDiplomado = mi_IDDiplomado;
        this.Duracion = mi_Duracion;
        this.precioDiplomado = mi_precioDiplomado;
        this.nombreDiplomado = mi_nombreDiplomado;
    }


    static save(duracion,precio,nombre) {
        return db.execute(
            `INSERT INTO Diplomado (Duracion, precioDiplomado, nombreDiplomado) VALUES ( ?, ?, ?)`, 
                [duracion,precio,nombre]);
    }

    static fetchAll() {
        return db.execute('Select * from Diplomado')
    }

    static fetchOne(nombre){
        return db.execute('Select * from Diplomado WHERE nombreDiplomado = ?',[nombre]);
    }

    static update(id,duracion,precio,nombre,status){
        return db.execute('UPDATE Diplomado SET Duracion=?, precioDiplomado=?, nombreDiplomado=?, diplomadoActivo=? WHERE IDDiplomado=?',
        [duracion,precio,nombre,status,id]);
    }

    static buscar(consulta) {
        return db.execute(
            'SELECT Diplomado.* FROM Diplomado LEFT JOIN Cursa ON Diplomado.IDDiplomado = Cursa.IdDiplomado WHERE Cursa.IdDiplomado IS NULL AND nombreDiplomado LIKE ? AND diplomadoActivo = 1;',
            [`%${consulta}%`]
        );
    }

    static buscar_noactivo(consulta) {
        return db.execute(
            'SELECT Diplomado.* FROM Diplomado WHERE nombreDiplomado LIKE ? AND diplomadoActivo = 0;',
            [`%${consulta}%`]
        );
    }

};

