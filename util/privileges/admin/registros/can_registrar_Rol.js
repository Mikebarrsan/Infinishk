module.exports = (request, response, next) => {
    let can_registrar_Rol = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Registrar Rol') {
            can_registrar_Rol = true;
        }
    }
    if (can_registrar_Rol) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}