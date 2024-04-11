module.exports = (request, response, next) => {
    let can_consultar_horarioAlumno = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Consultar horario alumno') {
            can_consultar_horarioAlumno = true;
        }
    }
    if (can_consultar_horarioAlumno) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}