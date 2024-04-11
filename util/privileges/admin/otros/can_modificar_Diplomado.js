module.exports = (request, response, next) => {
    let can_modificar_Diplomado = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Modificar diplomado') {
            can_modificar_Diplomado = true;
        }
    }
    if (can_modificar_Diplomado) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}