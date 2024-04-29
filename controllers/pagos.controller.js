const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const pagoDiplomado = require('../models/pagadiplomado.model');
const Pago_Extra = require('../models/pago_extra.model');
const Liquida = require('../models/liquida.model');
const Alumno = require('../models/alumno.model');
const Cursa = require('../models/cursa.model');
const Reporte = require('../models/reporte.model');

const csvParser = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const upload = multer({
    dest: 'uploads/'
});

// Configuras a moment con el locale. 
const moment = require('moment-timezone');
moment.locale('es-mx');

exports.get_pago = (request,response,next) => {
    response.render('pago/pago', {
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
};

exports.get_registrar_pago_extra = (request, response, next) => {
    response.render('pago/registrar_pago_extra', {
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
};

exports.post_registrar_pago_extra = (request, response, next) => {
    const pago_extra = new Pago_Extra(request.body.motivo, request.body.monto);

    pago_extra.save()
        .then(([rows, fieldData]) => {
            Pago_Extra.fetchAll()
                .then(([pagosExtra, fieldData]) => {
                    // Conviertes las fechas a tu zona horaria con moment
                    for (let count = 0; count < pagosExtra.length; count++) {
                        pagosExtra[count].createdAt = moment(new Date(pagosExtra[count].createdAt)).tz('America/Mexico_City').format('LL');
                    };

                    Pago_Extra.fetchNoAsignados()
                        .then(([pagosExtraNoAsignados, fieldData]) => {
                             // Conviertes las fechas a tu zona horaria con moment
                             for (let count = 0; count < pagosExtraNoAsignados.length; count++) {
                                 pagosExtraNoAsignados[count].createdAt = moment(new Date(pagosExtraNoAsignados[count].createdAt)).tz('America/Mexico_City').format('LL');
                             };

                            response.render('pago/pagos_extra', {
                                pagosNoAsignados: pagosExtraNoAsignados,
                                pagos: pagosExtra,
                                registrar: true,
                                username: request.session.username || '',
                                permisos: request.session.permisos || [],
                                rol: request.session.rol || "",
                                csrfToken: request.csrfToken()
                            })
                        })
                        .catch((error) => {
                            response.status(500).render('500', {
                                username: request.session.username || '',
                                permisos: request.session.permisos || [],
                                rol: request.session.rol || "",
                            });
                            console.log(error)
                        })
                })
                .catch((error) => {
                    response.status(500).render('500', {
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                    });
                    console.log(error)
                })
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error);
        });
};

exports.get_pago_extra = (request, response, next) => {
    Pago_Extra.fetchAll()
        .then(([pagosExtra, fieldData]) => {
            // Conviertes las fechas a tu zona horaria con moment
            for (let count = 0; count < pagosExtra.length; count++) {
                pagosExtra[count].createdAt = moment(new Date(pagosExtra[count].createdAt)).tz('America/Mexico_City').format('LL');
            };

            Pago_Extra.fetchNoAsignados()
                .then(([pagosExtraNoAsignados, fieldData]) => {
                        // Conviertes las fechas a tu zona horaria con moment
                        for (let count = 0; count < pagosExtraNoAsignados.length; count++) {
                            pagosExtraNoAsignados[count].createdAt = moment(new Date(pagosExtraNoAsignados[count].createdAt)).tz('America/Mexico_City').format('LL');
                        };
                        
                    response.render('pago/pagos_extra', {
                        pagosNoAsignados: pagosExtraNoAsignados,
                        pagos: pagosExtra,
                        registrar: false,
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        csrfToken: request.csrfToken()
                    })
                })
                .catch((error) => {
                    response.status(500).render('500', {
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                    });
                    console.log(error)
                })
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error)
        })
};

exports.post_pago_extra_modify = (request, response, next) => {
    Pago_Extra.update(request.body.id, request.body.motivo, request.body.monto)
        .then(([rows, fieldData]) => {
            response.redirect('/pagos/pagos_extra');
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error)
        })
};

exports.post_modify_status = (request, response, next) => {
    Pago_Extra.update_estatus(request.body.id, request.body.estatus)
        .then(([rows, fieldData]) => {
            response.status(200).json({
                success: true
            });
        })
        .catch((error) => {
            console.log(error)
        })
};

exports.post_pago_extra_delete = (request, response, next) => {
    Pago_Extra.delete(request.body.id)
        .then(([rows, fieldData]) => {
            response.status(200).json({
                success: true
            });
        })
        .catch((error) => {
            console.log(error)
        })
};

exports.get_solicitudes = (request, response, next) => {
    Liquida.fetchNoPagados()
        .then(([rows, fieldData]) => {
            Pago_Extra.fetchActivos()
                .then(([pagos_extra, fieldData]) => {
                    response.render('pago/solicitudes', {
                        solicitudes: rows,
                        pagos: pagos_extra,
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        csrfToken: request.csrfToken()
                    })
                })
                .catch((error) => {
                    response.status(500).render('500', {
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                    });
                    console.log(error)
                });
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error)
        });
};

exports.get_registrar_solicitud = (request, response, next) => {
    response.render('fetch_alumno', {
        pago_manual: false,
        solicitud_pago: true, 
        consultar_alumno: false,
        modificar_fichas: false,
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
};

exports.post_solicitudes_modify = (request, response, next) => {
    Liquida.update(request.body.id, request.body.pago)
        .then(([rows, fieldData]) => {
            response.redirect('/pagos/solicitudes');
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error)
        })
};

exports.post_solicitudes_delete = (request, response, next) => {
    Liquida.delete(request.body.id)
        .then(([rows, fieldData]) => {
            response.status(200).json({
                success: true
            });
        })
        .catch((error) => {
            console.log(error);
        })
};

exports.post_fetch_registrar_solicitud = (request, response, next) => {
    // Del input del usuario sacas solo la matricula con el regular expression
    let matches = request.body.buscar.match(/(\d+)/);
    Alumno.fetchOne(matches[0])
        .then(([alumno, fieldData]) => {
            Pago_Extra.fetchActivos()
                .then(([pagos_extra, fieldData]) => {
                    response.render('pago/registrar_solicitud', {
                        alumno: alumno,
                        pagos_extra: pagos_extra, 
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        csrfToken: request.csrfToken()
                    })
                })
                .catch((error) => {
                    response.status(500).render('500', {
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                    });
                    console.log(error);
                });
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error)
        });
};

exports.post_registrar_solicitud = (request, response, next) => {
    const solicitud_pago = new Liquida(request.body.matricula, request.body.pago);

    solicitud_pago.save()
        .then(([rows, fieldData]) => {
            response.redirect('/pagos/solicitudes');
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error);
        });
};

exports.get_ingresos = async (request, response, next) => {
    try {
        const [periodos, fieldData] = await Reporte.fetchPeriodos();
        
        let ingresosData = {};

        response.render('pago/reporte_ingresos', {
            periodos: periodos,
            ingresosData: ingresosData,
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            csrfToken: request.csrfToken()
        });
    } catch (error) {
        console.log(error);
    }
};

exports.post_ingresos = async (request, response, next) => {
    const periodoSelect = request.body.periodo;
    const tipoSelect = request.body.tipo;
    const fechaInicio = await Reporte.fetchFechaInicio(periodoSelect);
    const fechaFin = await Reporte.fetchFechaFin(periodoSelect);
    
    let ingresosData = {};

    if (fechaInicio.getMonth() >= 0 && fechaInicio.getMonth() <= 5) {
        // Para periodos Enero-Junio
        ingresosData.Enero = await Reporte.fetchIngresosMes(1, fechaInicio, fechaFin);
        ingresosData.Febrero = await Reporte.fetchIngresosMes(2, fechaInicio, fechaFin);
        ingresosData.Marzo = await Reporte.fetchIngresosMes(3, fechaInicio, fechaFin);
        ingresosData.Abril = await Reporte.fetchIngresosMes(4, fechaInicio, fechaFin);
        ingresosData.Mayo = await Reporte.fetchIngresosMes(5, fechaInicio, fechaFin);
        ingresosData.Junio = await Reporte.fetchIngresosMes(6, fechaInicio, fechaFin);
    } else {
        // Para periodos Julio-Diciembre
        ingresosData.Julio = await Reporte.fetchIngresosMes(7, fechaInicio, fechaFin);
        ingresosData.Agosto = await Reporte.fetchIngresosMes(8, fechaInicio, fechaFin);
        ingresosData.Septiembre = await Reporte.fetchIngresosMes(9, fechaInicio, fechaFin);
        ingresosData.Octubre = await Reporte.fetchIngresosMes(10, fechaInicio, fechaFin);
        ingresosData.Noviembre = await Reporte.fetchIngresosMes(11, fechaInicio, fechaFin);
        ingresosData.Diciembre = await Reporte.fetchIngresosMes(12, fechaInicio, fechaFin);
    }
    response.send({ingresosData});
};

exports.get_metodo_pago = async (request, response, next) => {
    try {
        const [periodos, fieldData] = await Reporte.fetchPeriodos();
        
        let ingresosData = {};

        response.render('pago/reporte_metodo_pago', {
            periodos: periodos,
            ingresosData: ingresosData,
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            csrfToken: request.csrfToken()
        });
    } catch (error) {
        console.log(error);
    }
};

exports.post_metodo_pago = async (request, response, next) => {
    const periodoSelect = request.body.periodo;
    const tipoSelect = request.body.tipo;
    const fechaInicio = await Reporte.fetchFechaInicio(periodoSelect);
    const fechaFin = await Reporte.fetchFechaFin(periodoSelect);
    
    let metodoPagoData = {};

    if (fechaInicio.getMonth() >= 0 && fechaInicio.getMonth() <= 5) {
        // Para periodos Enero-Junio
        metodoPagoData.Enero = await Reporte.fetchMetodoPagoEnero(fechaInicio, fechaFin);
        metodoPagoData.Febrero = await Reporte.fetchMetodoPagoFeb(fechaInicio, fechaFin);
        metodoPagoData.Marzo = await Reporte.fetchMetodoPagoMarzo(fechaInicio, fechaFin);
        metodoPagoData.Abril = await Reporte.fetchMetodoPagoAbril(fechaInicio, fechaFin);
        metodoPagoData.Mayo = await Reporte.fetchMetodoPagoMayo(fechaInicio, fechaFin);
        metodoPagoData.Junio = await Reporte.fetchMetodoPagoJun(fechaInicio, fechaFin);
    } else {
        // Para periodos Julio-Diciembre
        metodoPagoData.Julio = await Reporte.fetchMetodoPagoJul(fechaInicio, fechaFin);
        metodoPagoData.Agosto = await Reporte.fetchMetodoPagoAgo(fechaInicio, fechaFin);
        metodoPagoData.Septiembre = await Reporte.fetchMetodoPagoSept(fechaInicio, fechaFin);
        metodoPagoData.Octubre = await Reporte.fetchMetodoPagoOct(fechaInicio, fechaFin);
        metodoPagoData.Noviembre = await Reporte.fetchMetodoPagoNov(fechaInicio, fechaFin);
        metodoPagoData.Diciembre = await Reporte.fetchMetodoPagoDic(fechaInicio, fechaFin);
    }

    response.send({metodoPagoData});
};

exports.get_autocomplete = (request, response, next) => {

    if (request.params && request.params.valor_busqueda) {
        let matricula = ' ';
        let nombre = ' ';
        // Con la regular expression sacas toda la matricula
        let matches_matricula = request.params.valor_busqueda.match(/(\d+)/);
        // Y con esta sacas el texto para manejar todo tipo de busqueda
        let matches_nombre = request.params.valor_busqueda.replace(/[0-9]/g, '');

        if (matches_matricula && matches_nombre != '') {
            matricula = matches_matricula[0];
            nombre = matches_nombre.trim();

            Alumno.fetch_both(matricula, nombre)
                .then(([alumnos, fieldData]) => {
                    return response.status(200).json({
                        alumnos: alumnos
                    });
                })
                .catch((error) => {
                    console.log(error)
                });
        } else if (matches_matricula) {
            matricula = matches_matricula[0];

            Alumno.fetch(matricula)
                .then(([alumnos, fieldData]) => {
                    return response.status(200).json({
                        alumnos: alumnos,
                    });
                })
                .catch((error) => {
                    console.log(error)
                });
        } else if (matches_nombre != '') {
            nombre = matches_nombre;

            Alumno.fetch(nombre)
                .then(([alumnos, fieldData]) => {
                    return response.status(200).json({
                        alumnos: alumnos
                    });
                })
                .catch((error) => {
                    console.log(error)
                });
        }
    }
};