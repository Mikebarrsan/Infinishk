module.exports = (request, response, next) => {
    let can_actualizar_Base = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Actualizar Base de Datos') {
            can_actualizar_Base = true;
        }
    }
    if (can_actualizar_Base) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}