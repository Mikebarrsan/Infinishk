module.exports = (request, response, next) => {
    let can_realizar_pago = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Realizar Pago') {
            can_realizar_pago = true;
        }
    }
    if (can_realizar_pago) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}