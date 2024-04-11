module.exports = (request, response, next) => {
    let can_consultar_planPago = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Consultar plan de pago') {
            can_consultar_planPago = true;
        }
    }
    if (can_consultar_planPago) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}