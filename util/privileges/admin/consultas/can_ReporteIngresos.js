module.exports = (request, response, next) => {
    let can_ReporteIngresos = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Consultar Reporte Ingresos') {
            can_ReporteIngresos = true;
        }
    }
    if (can_ReporteIngresos) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}