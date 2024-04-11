module.exports = (request, response, next) => {
    let can_registrar_ArchivoTransferencia = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Registrar archivo de pagos por transferencia') {
            can_registrar_ArchivoTransferencia = true;
        }
    }
    if (can_registrar_ArchivoTransferencia) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}