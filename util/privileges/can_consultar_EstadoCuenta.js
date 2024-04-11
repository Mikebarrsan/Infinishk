module.exports = (request, response, next) => {
    let can_consultar_EstadoCuenta = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Consultar estado de cuenta') {
            can_consultar_EstadoCuenta = true;
        }
    }
    if (can_consultar_EstadoCuenta) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}