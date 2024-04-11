module.exports = (request, response, next) => {
    let can_AdministrarSolicitud = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Modificar Solicitud de Pago' || permiso.funcion == 'Eliminar Solicitud de Pago') {
            can_AdministrarSolicitud = true;
        }
    }
    if (can_AdministrarSolicitud) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}