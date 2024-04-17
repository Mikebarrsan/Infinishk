const db = require('../util/database');

module.exports = class Colegiatura{
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDColegiatura,mi_IDPrecioCredito,mi_IDPlanPago,mi_IDPeriodo,mi_montoPagadoTotal){
        this.IDColegiatura = mi_IDColegiatura;
        this.IDPrecioCredito = mi_IDPrecioCredito;
        this.IDPlanPago = mi_IDPlanPago;
        this.IDPeriodo = mi_IDPeriodo;
        this.montoPagadoTotal = mi_montoPagadoTotal;
    }

    static update_transferencia(monto,idcolegiatura){
        return db.execute('UPDATE Colegiatura SET montoPagadoTotal = montoPagadoTotal + ? \n WHERE IDColegiatura = ?',
        [monto, idcolegiatura]);
    }

    static fetchColegiaturaActiva(matricula) {
        return db.execute(`SELECT DISTINCT(C.IDColegiatura), P.Nombre
        FROM Colegiatura AS C, Deuda AS D, Periodo AS P
        WHERE C.IDColegiatura = D.IDColegiatura
        AND C.IDPeriodo = P.IDPeriodo AND P.periodoActivo = '1'
        AND D.Matricula = ?`, [matricula]);
    }

    static fetchNoPagadas(IDColegiatura){
        return db.execute(`SELECT IDDeuda, (montoAPagar - Descuento) AS 'montoAPagar', 
        fechaLimitePago, montoPagado FROM Deuda WHERE Pagado = 0
        AND IDColegiatura = ? `,[IDColegiatura]);
    }
};