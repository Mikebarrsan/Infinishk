// Checa si el usuario esta loggeado con la variable que creamos anteriormente
module.exports = (request, response, next) => {
    // Si no esta loggeada entonces hace el redirect al login
    if (!request.session.isLoggedIn) {
        return response.redirect('/auth/login');
    }
    next();
}