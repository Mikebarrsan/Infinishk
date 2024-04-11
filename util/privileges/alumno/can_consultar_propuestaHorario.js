module.exports = (request, response, next) => {
    let can_consultar_horario = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Consultar Propuesta de Horario') {
            can_consultar_horario = true;
        }
    }
    if (can_consultar_horario) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}