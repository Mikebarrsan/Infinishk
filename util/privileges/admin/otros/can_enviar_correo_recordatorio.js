module.exports = (request, response, next) => {
    let can_Enviar_Correo = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Enviar correo electronico de recordatorio de pago') {
            can_Enviar_Correo = true;
        }
    }
    if (can_Enviar_Correo) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}