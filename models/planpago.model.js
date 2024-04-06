const db = require('../util/database');

module.exports = class PlanPago{
    constructor(mi_IDPlanPago,mi_nombrePlan,mi_numeroPagos){
        this.IDPlanPago = mi_IDPlanPago;
        this.nombrePlan = mi_nombrePlan;
        this.numeroPagos= mi_numeroPagos;
    }

    static fetchAll() {
        return db.execute('Select * from planpago')
    }
}
