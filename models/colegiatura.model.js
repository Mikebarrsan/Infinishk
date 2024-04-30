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
        return db.execute('UPDATE Colegiatura SET montoPagadoTotal = montoPagadoTotal + ? WHERE IDColegiatura = ?',
        [monto, idcolegiatura]);
    }

    static update_Colegiatura(monto_a_usar, idColegiatura){
        return db.execute(`UPDATE Colegiatura 
        SET montoPagadoTotal = montoPagadoTotal + ?  
        WHERE IDColegiatura = ?`, [monto_a_usar, idColegiatura]);
    }

    static fetchColegiaturaActiva(matricula) {
        return db.execute(`SELECT DISTINCT(C.IDColegiatura), P.Nombre
        FROM Colegiatura AS C, Deuda AS D, Periodo AS P
        WHERE C.IDColegiatura = D.IDColegiatura
        AND C.IDPeriodo = P.IDPeriodo AND P.periodoActivo = '1'
        AND D.Matricula = ?`, [matricula]);
    }
    // Transacción para crear colegiatura y fichas al mismo tiempo on¿ nada en caso de algún error
    static createColegiaturasFichas(IDPlanPago, matricula, precioCredito){
        return db.execute(`CALL crear_colegiaturas_fichas(?,?,?)`, [IDPlanPago, matricula, precioCredito]);
    }
};