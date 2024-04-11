module.exports = (request, response, next) => {
    let can_registrar_PrecioCredito = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Registrar Costo Credito') {
            can_registrar_PrecioCredito = true;
        }
    }
    if (can_registrar_PrecioCredito) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}