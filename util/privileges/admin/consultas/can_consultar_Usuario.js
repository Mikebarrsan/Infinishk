module.exports = (request, response, next) => {
    let can_consultarUsuario = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Consultar Usuario') {
            can_consultarUsuario = true;
        }
    }
    if (can_consultarUsuario) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}