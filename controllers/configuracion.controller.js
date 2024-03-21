const Periodo = require('../models/periodo.model');

exports.get_configuracion = (request, response, next) => {
    response.render('configuracion/configuracion');
};

exports.get_periodos = (request, response, next) => {
    Periodo.fetchAll()
        .then(([rows, fieldData]) => {
            response.render('configuracion/periodos', {
                periodos: rows
            });
        })
        .catch((error) => {
            console.log(error);
        })
};