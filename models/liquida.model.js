const db = require('../util/database');

module.exports = class Liquida {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_matricula, mi_IDPagoExtra) {
        this.matricula = mi_matricula;
        this.IDPagoExtra = mi_IDPagoExtra;
    }

    save() {
        return db.execute(`INSERT INTO Liquida
        (Matricula, IDPagosExtras, fechaPago, Pagado)
        VALUES (?, ?, Null, 0)`, [this.matricula, this.IDPagoExtra]);
    }

    static fetchID(matricula){
        return db.execute('Select IDLiquida from liquida WHERE Matricula = ?',[matricula]);
    }

    static fetch_Pendientes(matricula) {
        return db.execute(`SELECT IDLiquida, motivoPago, montoPagar From Liquida AS L, pagosExtras AS P
        WHERE L.IDPagosExtras = P.IDPagosExtras AND L.Matricula = ? AND L.Pagado = 0`,
            [matricula]);
    }
    
    static fetchNoPagados() {
        return db.execute(`SELECT L.IDLiquida, A.Nombre, A.Apellidos, 
        L.Matricula, P.IDPagosExtras, P.motivoPago, P.montoPagar
        FROM Liquida AS L, pagosExtras AS P, Alumno AS A
        WHERE L.IDPagosExtras = P.IDPagosExtras 
        AND L.Matricula = A.Matricula 
        AND Pagado = 0`);
    }

    static updateExitoso(nota,fecha,id){
        return db.execute('UPDATE liquida SET Pagado = 1, metodoPago= "Web Tarjeta", fechaPago=?, Nota = ? WHERE IDLiquida = ?',
        [fecha,nota, id]);
    }

    static updateDeclinado(nota,fecha,id){
        return db.execute('UPDATE liquida SET Pagado = 0, metodoPago= "Web Tarjeta", fechaPago=?, Nota = ? WHERE IDLiquida = ?',
        [fecha,nota, id]);
    }

    static delete(id) {
        return db.execute('DELETE FROM Liquida WHERE IDLiquida = ?', [id]);
    }

}