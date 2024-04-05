const PlanPago = require('../models/planpago.model');

exports.get_configuracion = (request,response,next) => {
    response.render('configuracion/configuracion');
};

exports.get_administrar_planpago = (request, response, next) => {
    console.log(request.session.rol);
    PlanPago.fetchAll()
        .then(([planpagos]) => {
           response.render('configuracion/administrar_planpago',{
                planpago: planpagos,
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
           });
        })
        .catch((error) => {
            console.log(error);
        });
};
