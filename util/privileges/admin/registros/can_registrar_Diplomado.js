module.exports = (request, response, next) => {
    let can_registrar_Diplomado = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Registrar diplomado') {
            can_registrar_Diplomado = true;
        }
    }
    if (can_registrar_Diplomado) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}