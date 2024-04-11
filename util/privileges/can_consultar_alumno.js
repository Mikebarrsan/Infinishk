module.exports = (request, response, next) => {
    let can_consultar_Alumno = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Consultar Alumno') {
            can_consultar_Alumno = true;
        }
    }
    if (can_consultar_Alumno) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}