const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const PagoExtra = require('../models/pago_extra.model');
const Alumno = require('../models/alumno.model');
const Periodo = require('../models/periodo.model');
const EstudianteProfesional = require('../models/estudianteprofesional.model');
const PagaDiplomado = require('../models/pagadiplomado.model');

// Configuras a moment con el locale. 
const moment = require('moment-timezone');
moment.locale('es-mx');

exports.get_estado_cuenta = async (request, response, next) => {
    try {

        const matricula = request.session.username;
        const [cargosExtra] = await PagoExtra.fetchSinPagar(matricula);
        const [pagosExtra] = await PagoExtra.fetchPagados(matricula);
        
        // Formatear fechas
        for (let count = 0; count < pagosExtra.length; count++) {
            pagosExtra[count].fechaPago = moment(pagosExtra[count].fechaPago).tz('America/Mexico_City').format('LL');
        }
        
        if(matricula[0] == '1') {
            
            // Consultas para estudiante
            
            const [pagos] = await Pago.fetchOne(matricula);
            const estudianteProfesional = await EstudianteProfesional.fetchOne(request.session.username); 
            const [deuda] = await Deuda.fetchDeuda(matricula);
            
            // Formatear fechas
            for (let count = 0; count < deuda.length; count++){
                deuda[count].fechaLimitePago = moment(deuda[count].fechaLimitePago).format('LL');
            }

            for (let count = 0; count < pagos.length; count++) {
                pagos[count].fechaPago = moment(pagos[count].fechaPago).tz('America/Mexico_City').format('LL');
            }

            response.render('estadocuenta/estado_cuenta', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                csrfToken: request.csrfToken(),
                estudianteProfesional: estudianteProfesional[0][0],
                pagos: pagos,
                deuda: deuda,
                pagosExtra: cargosExtra,
                pagadosExtra: pagosExtra,
                matricula: matricula,
                rol: request.session.rol || "",
                
            });
        } else if (matricula[0] == '8') {

        const [pagosDiplomado] = await PagaDiplomado.fetchPagosDiplomado(matricula);

        // Formatear fechas
        for (let count = 0; count < pagosDiplomado.length; count++) {
            pagosDiplomado[count].fechaPago = moment(pagosDiplomado[count].fechaPago).tz('America/Mexico_City').format('LL');
        }

        response.render('estadocuenta/estado_cuenta', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            csrfToken: request.csrfToken(),
            pagosExtra: cargosExtra,
            pagadosExtra: pagosExtra,
            matricula: matricula,
            rol: request.session.rol || "",
            pagosDiplomado: pagosDiplomado,
            
        });

        }

        
    } catch (error) {
        response.status(500).send("Error en la obtención del estado de cuenta: " + error);
    }
}

