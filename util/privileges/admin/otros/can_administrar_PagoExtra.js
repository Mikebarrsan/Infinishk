module.exports = (request, response, next) => {
    let can_administrar_PagoExtra = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Modificar Pago Extra' || permiso.funcion == 'Eliminar Pago Extra') {
            can_administrar_PagoExtra = true;
        }
    }
    if (can_administrar_PagoExtra) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}