const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const PagoExtra = require('../models/pago_extra.model');
const Alumno = require('../models/alumno.model');
const Periodo = require('../models/periodo.model');
const EstudianteProfesional = require('../models/estudiante_profesional.model');
const PagaDiplomado = require('../models/pagadiplomado.model');
const Cursa = require('../models/cursa.model')

// Configuras a moment con el locale. 
const moment = require('moment-timezone');
const estudianteProfesional = require('../models/estudiante_profesional.model');
moment.locale('es-mx');

exports.get_estado_cuenta = async (request, response, next) => {
    try {

        const now = moment().tz('America/Mexico_City').startOf('day').subtract(1, 'days').format();
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
            const [deuda] = await Deuda.fetchDeudaEstado(matricula);
            
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
                fechaActual: now,
                pagosExtra: cargosExtra,
                pagadosExtra: pagosExtra,
                matricula: matricula,
                rol: request.session.rol || "",
                
            });
        } else if (matricula[0] == '8') {

        const [pagosDiplomado] = await PagaDiplomado.fetchPagosDiplomado(matricula);
        const [diplomadoCursando] = await Cursa.fetchDiplomadosCursando(matricula);

        // Formatear fechas
        for (let count = 0; count < pagosDiplomado.length; count++) {
            pagosDiplomado[count].fechaPago = moment(pagosDiplomado[count].fechaPago).tz('America/Mexico_City').format('LL');
        }

        for (let count = 0; count < diplomadoCursando.length; count++) {
            diplomadoCursando[count].fechaInicio = moment(diplomadoCursando[count].fechaInicio).format('LL');
        }

        for (let count = 0; count < diplomadoCursando.length; count++) {
            diplomadoCursando[count].fechaFin = moment(diplomadoCursando[count].fechaFin).format('LL');
        }

        response.render('estadocuenta/estado_cuenta', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            csrfToken: request.csrfToken(),
            pagosExtra: cargosExtra,
            pagadosExtra: pagosExtra,
            fechaActual: now,
            matricula: matricula,
            diplomados: diplomadoCursando,
            rol: request.session.rol || "",
            pagosDiplomado: pagosDiplomado,
            
        });

        }

        
    } catch (error) {
        console.log(error);
        response.status(500).render('500', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            error_alumno: false
        });
    }
}

