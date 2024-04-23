const db = require('../util/database');

module.exports = class Colegiatura {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDColegiatura, mi_IDPrecioCredito, mi_IDPlanPago, mi_IDPeriodo, mi_montoPagadoTotal) {
        this.IDColegiatura = mi_IDColegiatura;
        this.IDPrecioCredito = mi_IDPrecioCredito;
        this.IDPlanPago = mi_IDPlanPago;
        this.IDPeriodo = mi_IDPeriodo;
        this.montoPagadoTotal = mi_montoPagadoTotal;
    }

    static update_transferencia(monto, idcolegiatura) {
        return db.execute('UPDATE Colegiatura SET montoPagadoTotal = montoPagadoTotal + ? WHERE IDColegiatura = ?',
            [monto, idcolegiatura]);
    }

    static update_Colegiatura(monto_a_usar, idColegiatura) {
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

    static fetchDatosColegiatura(fechaInicio, fechaFin) {
        return db.execute('SELECT D.Matricula, A.Nombre, A.Apellidos, A.referenciaBancaria, P.IDPago, P.Motivo, P.montoPagado, P.metodoPago, P.fechaPago, P.Nota FROM Deuda AS D JOIN Pago AS P ON D.IDDeuda = P.IDDeuda JOIN Alumno AS A ON D.Matricula = A.Matricula JOIN Colegiatura AS C ON D.IDColegiatura = C.IDColegiatura JOIN Periodo AS Per ON C.IDPeriodo = Per.IDPeriodo WHERE ?>= Per.fechaInicio AND ?<= Per.fechaFin ORDER BY D.Matricula ASC', [fechaInicio, fechaFin]);
    }

};