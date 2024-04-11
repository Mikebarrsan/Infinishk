module.exports = (request, response, next) => {
    let can_consultar_costoCredito = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Consultar Costo Credito') {
            can_consultar_costoCredito = true;
        }
    }
    if (can_consultar_costoCredito) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}