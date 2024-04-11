module.exports = (request, response, next) => {
    let can_AlumnosAtrasados = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Consultar a alumnos atrasados en pagos') {
            can_AlumnosAtrasados = true;
        }
    }
    if (can_AlumnosAtrasados) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}