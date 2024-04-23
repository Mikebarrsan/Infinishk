const db = require('../util/database');

module.exports = class Pago {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDPago,mi_IDDeuda,mi_Motivo,mi_montoPagado,mi_Nota,mi_tipoPago,mi_fechaPago){
        this.IDPago = mi_IDPago;
        this.IDDeuda = mi_IDDeuda;
        this.Motivo = mi_Motivo;
        this.montoPagado = mi_montoPagado;
        this.Nota = mi_Nota;
        this.tipoPago = mi_tipoPago;
        this.fechaPago = mi_fechaPago;
    }

    static fetch_fecha_pago(fecha){
        return db.execute('SELECT fechaPago,montoPagado FROM pago WHERE fechaPago = ?',
        [fecha]);
    }

    static static save_transferencia(id,monto,nota,fechaid,monto,nota,fecha) {
        return db.execute(`CALL insertar_Pago(?, '', ?, ?, 'Transferencia', ?);`, 
                [id, monto, nota,fecha]);
    }

    static save_pago_manual(idDeuda, motivo, monto, nota, metodo, fecha) {
        return db.execute(`CALL insertar_Pago(?, ?, ?, ?, ?, ?);`,
            [idDeuda, motivo, monto, nota, metodo, fecha]);
    }
    
    
}