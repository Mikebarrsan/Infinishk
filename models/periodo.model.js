const db = require('../util/database');

module.exports = class Periodo {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDPeriodo, mi_fechaInicio, mi_fechaFin, mi_Nombre, mi_periodoActivo) {
        this.IDPeriodo = mi_IDPeriodo
        this.fechaInicio = mi_fechaInicio;
        this.fechaFin = mi_fechaFin;
        this.Nombre = mi_Nombre;
        this.periodoActivo = mi_periodoActivo;
    }

    static fetchOne(id) {
        return db.execute(`SELECT IDPeriodo, fechaInicio, fechaFin, Nombre, periodoActivo
        FROM periodo WHERE IDPeriodo = ?`, [id]);
    }

    static updatePeriodo(id,inicio,fin,nombre,status) {
        return db.execute('UPDATE periodo SET IDPeriodo=?, fechaInicio=?, fechaFin=?, Nombre=?, periodoActivo=?  WHERE IDPeriodo=?', [id,inicio,fin,nombre,status,id])
    }

    static savePeriodo(id,inicio,fin,nombre,status){
        return db.execute('INSERT INTO `periodo`(`IDPeriodo`, `fechaInicio`, `fechaFin`, `Nombre`, `periodoActivo`) VALUES (?,?,?,?,?)',[id,inicio,fin,nombre,status])
    }

}