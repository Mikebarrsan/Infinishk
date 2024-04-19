const db = require('../util/database');

module.exports = class Diplomado{
    constructor(mi_IDDiplomado,mi_Duracion,
        mi_precioDiplomado,mi_nombreDiplomado){
        this.IDDiplomado = mi_IDDiplomado;
        this.Duracion = mi_Duracion;
        this.precioDiplomado = mi_precioDiplomado;
        this.nombreDiplomado = mi_nombreDiplomado;
    }


    static save(duracion,precio,nombre) {
        return db.execute(
            `INSERT INTO diplomado (Duracion, precioDiplomado, nombreDiplomado)
            VALUES ( ?, ?, ?)`, 
                [duracion,precio,nombre]);
    }

    static fetchAllActives() {
        return db.execute('Select * from diplomado WHERE diplomadoActivo = 1')
    }

    static fetchAllNoActives() {
        return db.execute('Select * from diplomado WHERE diplomadoActivo = 0')
    }

    static fetchAllInProgress() {
        return db.execute(`Select * from diplomado WHERE diplomadoActivo = 1 
        AND IDDiplomado IN (Select IDDiplomado from cursa 
        WHERE Now() > fechainicio AND Now() < fechafin)`)
    }

    static fetchOne(nombre){
        return db.execute('Select * from diplomado WHERE nombreDiplomado = ?'
        ,[nombre]);
    }

    static update(id,duracion,precio,nombre,status){
        return db.execute(`UPDATE diplomado SET Duracion=?, precioDiplomado=?,
         nombreDiplomado=?, diplomadoActivo=? WHERE IDDiplomado=?`,
        [duracion,precio,nombre,status,id]);
    }

    static buscar(consulta) {
        return db.execute(`SELECT diplomado.* FROM diplomado LEFT JOIN cursa 
        ON diplomado.idDiplomado = cursa.idDiplomado WHERE cursa.idDiplomado 
        IS NULL AND nombreDiplomado LIKE ? AND diplomadoActivo = 1;`,
            [`%${consulta}%`]
        );
    }

    static buscar_noactivo(consulta) {
        return db.execute(`SELECT diplomado.* FROM diplomado WHERE 
        nombreDiplomado LIKE ? AND diplomadoActivo = 0;`,
            [`%${consulta}%`]
        );
    }

    static buscar_en_curso(consulta)
    {
        return db.execute(`SELECT diplomado.* FROM diplomado WHERE
         nombreDiplomado LIKE ? AND diplomadoActivo = 1 AND 
         IDDiplomado NOT IN (Select IDDiplomado from cursa 
        WHERE Now() > fechainicio AND Now() < fechafin)`, [`%${consulta}%`]
    );
    }

};

