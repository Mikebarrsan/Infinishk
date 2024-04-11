module.exports = (request, response, next) => {
    let can_registrar_PlanPago = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Registrar Plan de Pago') {
            can_registrar_PlanPago = true;
        }
    }
    if (can_registrar_PlanPago) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}