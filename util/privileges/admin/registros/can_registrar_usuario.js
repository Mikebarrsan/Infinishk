module.exports = (request, response, next) => {
    let can_registrar_Usuario = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Registrar usuario') {
            can_registrar_Usuario = true;
        }
    }
    if (can_registrar_Usuario) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}