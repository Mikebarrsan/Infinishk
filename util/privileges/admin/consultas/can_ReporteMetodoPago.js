module.exports = (request, response, next) => {
    let can_ReporteMetodoPago = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Consultar Reporte Metodo de Pago') {
            can_ReporteMetodoPago = true;
        }
    }
    if (can_ReporteMetodoPago) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}