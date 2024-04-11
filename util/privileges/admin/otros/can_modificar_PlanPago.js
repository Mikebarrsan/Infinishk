module.exports = (request, response, next) => {
    let can_modificar_PlanPago = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Modificar Plan de Pago') {
            can_modificar_PlanPago = true;
        }
    }
    if (can_modificar_PlanPago) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}