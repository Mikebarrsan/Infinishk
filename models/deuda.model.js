const db = require('../util/database');

module.exports = class Deuda {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDDeuda,mi_IDColegiatura,mi_Matricula,mi_montoPagado,mi_montoAPagar,mi_fechaLimitePago,mi_Pagado){
        this.IDDeuda = mi_IDDeuda;
        this.IDColegiatura = mi_IDColegiatura;
        this.Matricula = mi_Matricula
        this.montoPagado = mi_montoPagado;
        this.montoAPagar =mi_montoAPagar;
        this.fechaLimitePago = mi_fechaLimitePago;
        this.Pagado = mi_Pagado;
    };

    static fetchDeuda(matricula){
        return db.execute(`SELECT (D.montoAPagar - D.Descuento - D.montoPagado) AS "montoAPagar" 
        FROM Colegiatura AS C, Deuda AS D, Periodo AS P
        WHERE C.IDColegiatura = D.IDColegiatura AND C.IDPeriodo = P.IDPeriodo 
        AND P.periodoActivo = '1' AND D.Matricula = ? AND D.Pagado = 0`,
        [matricula]);
    };

    
    static fetchDeudaPagada(matricula){
        return db.execute('SELECT (montoAPagar-Descuento-montoPagado) AS "montoAPagar" FROM Deuda WHERE Matricula = ? AND Pagado = 1',
        [matricula]);
    };

    static fetchEstado(matricula){
        return db.execute('SELECT Pagado FROM Deuda WHERE Matricula = ?',
        [matricula]);
    };

    static fetchColegiatura(id){
        return db.execute('SELECT IDColegiatura FROM Deuda WHERE IDDeuda = ?',
        [id]);
    };

    static statusDeuda(id){
        return db.execute('SELECT Pagado FROM Deuda WHERE IDDeuda = ?',
        [id]);
    };

    static update_transferencia(monto,id_deuda){
        return db.execute('UPDATE Deuda SET montoPagado = montoPagado + ? WHERE IDDeuda = ?',
        [monto, id_deuda]);
    };

    static fetchIDDeuda(matricula){
        return db.execute('SELECT IDDeuda FROM Deuda WHERE Matricula = ? AND Pagado = 0 AND Now() < fechaLimitePago',
        [matricula]);
    };

    static fetchIDDeudaPagada(matricula){
        return db.execute('SELECT IDDeuda FROM Deuda WHERE Matricula = ? AND Pagado = 1',
        [matricula]);
    };
    
    static fetchIDColegiatura(matricula){
        return db.execute('SELECT IDColegiatura FROM Deuda WHERE Matricula = ?',
        [matricula]);
    }

    static fetchNoPagadas(IDColegiatura) {
        return db.execute(`SELECT IDDeuda, (montoAPagar - Descuento) AS 'montoAPagar', 
        fechaLimitePago, montoPagado FROM Deuda WHERE Pagado = 0
        AND IDColegiatura = ? `, [IDColegiatura]);
    };

    static update_Deuda(monto_a_usar, id_deuda) {
        return db.execute('UPDATE Deuda SET montoPagado = montoPagado + ? WHERE IDDeuda = ?', 
        [monto_a_usar, id_deuda]);
    };

    static fetchDeudasPeriodo(fecha_actual) {
        return db.execute(`SELECT IDDeuda, montoAPagar, fechaLimitePago
        FROM Deuda AS D, Colegiatura AS C, Periodo AS P
        WHERE C.IDColegiatura = D.IDColegiatura AND C.IDPeriodo = P.IDPeriodo
        AND P.periodoActivo = '1' AND D.Pagado = 0 AND D.Recargos = 0 AND D.fechaLimitePago < ?`,
        [fecha_actual]);
    };

    static fetchDeudasRecordatorio(fecha_actual) {
        return db.execute(`SELECT montoAPagar, fechaLimitePago, U.correoElectronico
        FROM Deuda AS D, Colegiatura AS C, Periodo AS P, Usuario AS U
        WHERE C.IDColegiatura = D.IDColegiatura AND C.IDPeriodo = P.IDPeriodo 
        AND U.IDUsuario = D.Matricula AND P.periodoActivo = '1' AND D.Pagado = 0 
        AND D.fechaLimitePago > ?`, [fecha_actual]);
    };

    static fetchDeudasCorreoAtrasado(fecha_actual) {
        return db.execute(`SELECT fechaLimitePago, U.correoElectronico
        FROM Deuda AS D, Colegiatura AS C, Periodo AS P, Usuario AS U
        WHERE C.IDColegiatura = D.IDColegiatura AND C.IDPeriodo = P.IDPeriodo 
        AND U.IDUsuario = D.Matricula AND P.periodoActivo = '1' AND D.Pagado = 0 
        AND D.fechaLimitePago < ?`, [fecha_actual]);
    }

    static setRecargosDeuda(IDDeuda, montoRecargo){
        return db.execute(`UPDATE Deuda SET montoAPagar = ?, Recargos = 1
        WHERE IDDeuda = ?`, [montoRecargo, IDDeuda]);
    };
    
}