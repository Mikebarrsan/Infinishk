const db = require('../util/database');

module.exports = class Periodo {

    constructor(idPeriodo_1, fecha_in_1, fecha_fin_1, nombre_1, activo_1) {
        this.idPeriodo = idPeriodo_1;
        this.fecha_in = fecha_in_1;
        this.fecha_fin = fecha_fin_1;
        this.nombre = nombre_1;
        this.activo = activo_1;
    }

    // Función para sacar todos los periodos de la base de datos
    static fetchAll() {
        return db.execute('SELECT * FROM Periodo');
    }

}