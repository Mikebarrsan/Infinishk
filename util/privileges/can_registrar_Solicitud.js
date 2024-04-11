module.exports = (request, response, next) => {
    let can_RegistrarSolicitud = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Registrar Solicitud de Pago') {
            can_RegistrarSolicitud = true;
        }
    }
    if (can_RegistrarSolicitud) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}