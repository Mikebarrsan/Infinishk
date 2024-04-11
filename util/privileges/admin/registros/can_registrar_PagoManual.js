module.exports = (request, response, next) => {
    let can_registrar_Pago_Manual = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Registrar Pago Manual') {
            can_registrar_Pago_Manual = true;
        }
    }
    if (can_registrar_Pago_Manual) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}