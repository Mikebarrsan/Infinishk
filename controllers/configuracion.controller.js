const Periodo = require('../models/periodo.model');

exports.get_configuracion = (request, response, next) => {
    response.render('configuracion');
};

exports.get_periodos = (request, response, next) => {
    Periodo.fetchAll()
    .then(([rows, fieldData]) => {
        response.render('periodos', {
            periodos: rows
        });
    })
    .catch((error) => {
        console.log(error);
    })
};