module.exports = (request, response, next) => {
    let can_registrar_PagoExtra = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Registrar Pago Extra') {
            can_registrar_PagoExtra = true;
        }
    }
    if (can_registrar_PagoExtra) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}