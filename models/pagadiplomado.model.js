const db = require('../util/database');

module.exports = class pagoDiplomado {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_Matricula,mi_IDDiplomado,mi_fechaPago,mi_montoPagado,mi_Motivo,mi_Nota,mi_tipoPago){
        this.Matricula = mi_Matricula;
        this.IDDiplomado = mi_IDDiplomado;
        this.fechaPago = mi_fechaPago;
        this.montoPagado = mi_montoPagado;
        this.Motivo = mi_Motivo;
        this.Nota = mi_Nota;
        this.tipoPago = mi_tipoPago;
    }

    static save_transferencia(matricula,id,fecha,monto,nota) {
        return db.execute(
            `CALL insertarPagoDiplomado (?,?,?,?, '', ?, 'Transferencia');`, 
                [matricula,id,fecha,monto,nota]);
    }

    static save_tarjeta(matricula,id,fecha,monto,motivo,nota) {
        return db.execute(
            `CALL insertarPagoDiplomado (?,?,?,?,?,?,'Web Tarjeta');`, 
                [matricula,id,fecha,monto,motivo,nota]);
    }
        
}