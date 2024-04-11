module.exports = (request, response, next) => {
    let can_modificar_Deuda = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Modificar Ficha de Pago/Deuda') {
            can_modificar_Deuda = true;
        }
    }
    if (can_modificar_Deuda) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}