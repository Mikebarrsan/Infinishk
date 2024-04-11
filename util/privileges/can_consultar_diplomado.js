module.exports = (request, response, next) => {
    let can_consultar_diplomado = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Consultar diplomado') {
            can_consultar_diplomado = true;
        }
    }
    if (can_consultar_diplomado) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}