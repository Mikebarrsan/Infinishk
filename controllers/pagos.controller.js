const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const PagoDiplomado = require('../models/pagadiplomado.model');
const Pago_Extra = require('../models/pago_extra.model');
const Liquida = require('../models/liquida.model');
const Alumno = require('../models/alumno.model');
const Cursa = require('../models/cursa.model');
const Periodo = require('../models/periodo.model');
const Colegiatura = require('../models/colegiatura.model');
const Usuario = require('../models/usuario.model')

const csvParser = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const upload = multer({
    dest: 'uploads/'
});

// Configuras a moment con el locale. 
const moment = require('moment-timezone');
moment.locale('es-mx');

exports.get_pago = (request, response, next) => {
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

exports.get_pago_alumno = (request, response, next) => {

    // Del input del usuario sacas solo la matricula con el regular expression
    let username = request.session.username;
    Alumno.fetchOne(username)
        .then(([alumno, fieldData]) => {
            Liquida.fetch_Pendientes(username)
                .then(async ([solicitud_otro_pago, fieldData]) => {
                    const [periodoActivo, fieldData_2] = await Periodo.fetchActivo();
                    // Si es estudiante de colegiatura sacas la siguiente información
                    if (username[0] == '1') {
                        const [infoColegiatura, fieldData] = await Colegiatura.fetchColegiaturaActiva(username);
                        let info_Deuda = '';

                        // Si existe sacas la información de la deuda
                        if (infoColegiatura.length != 0) {
                            const [infoDeuda, fieldData_3] = await Deuda.fetchNoPagadas(infoColegiatura[0].IDColegiatura);

                            // Conviertes la fecha si existe
                            for (let count = 0; count < infoDeuda.length; count++) {
                                infoDeuda[count].fechaLimitePago = moment(new Date(infoDeuda[count].fechaLimitePago)).tz('America/Mexico_City').format('LL');
                            }
                            info_Deuda = infoDeuda;
                        };
                        const [totalDeuda, fieldData_4] = await Deuda.fetchDeuda(username);

                        response.render('pago/realizar_pago', {
                            alumno: alumno,
                            periodo: periodoActivo,
                            solicitudes: solicitud_otro_pago,
                            colegiatura: infoColegiatura,
                            deuda: info_Deuda,
                            totales: totalDeuda,
                            pago_col: true,
                            diplomado: '',
                            pagoDiplomado: '',
                            username: request.session.username || '',
                            permisos: request.session.permisos || [],
                            rol: request.session.rol || "",
                            csrfToken: request.csrfToken()
                        })
                        // Si no, es alumno de diplomado
                    } else if (username[0] == '8') {
                        // Sacas información del diplomado que estan cursando
                        const [infoDiplomado, fieldData] = await Cursa.fetchDiplomadosCursando(username);
                        let infoPagosDiplomado = '';
                        if (infoDiplomado.length != 0) {
                            // Sacas información de algún pago si es que existe
                            const [infoPagosDipl, fieldData_2] = await Cursa.fetchPagosHechos(username, infoDiplomado[0].IDDiplomado);
                            // Conviertes la fecha si existe
                            for (let count = 0; count < infoPagosDipl.length; count++) {
                                infoPagosDipl[count].fechaPago = moment(new Date(infoPagosDipl[count].fechaPago)).tz('America/Mexico_City').format('LL');
                            }
                            infoPagosDiplomado = infoPagosDipl;
                        }
                        response.render('pago/realizar_pago', {
                            alumno: alumno,
                            periodo: periodoActivo,
                            solicitudes: solicitud_otro_pago,
                            colegiatura: '',
                            deuda: '',
                            totales: '',
                            pago_col: false,
                            diplomado: infoDiplomado,
                            pagoDiplomado: infoPagosDiplomado,
                            username: request.session.username || '',
                            permisos: request.session.permisos || [],
                            rol: request.session.rol || "",
                            csrfToken: request.csrfToken()
                        })
                    };
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
            console.log(error);
        });
};

// Importar el archivo con las funciones de cifrado
const cipher = require('../util/cipher');
const axios = require('axios');

exports.post_mandar_pago = (request, response, next) => {
    let monto = Number(request.body.monto);
    monto = monto.toFixed(2);
    let matricula = request.body.matricula;

    console.log(monto, matricula);

    // Usar el paquete para facilidad y poner true para que este indentado
    var XMLWriter = require('xml-writer');
    xml = new XMLWriter(true);
    // Empiezas el documento y el objeto padre
    xml.startDocument();
    xml.startElement('P');
    xml.startElement('business');
    xml.startElement('id_company');
    xml.text('SNBX');
    xml.endElement('id_company');
    xml.startElement('id_branch');
    xml.text('01SNBXBRNCH');
    xml.endElement('id_branch');
    xml.startElement('user');
    xml.text('SNBXUSR0123');
    xml.endElement('user');
    xml.startElement('pwd');
    xml.text('SECRETO');
    xml.endElement('pwd');
    xml.endElement('business');
    xml.startElement('nb_fpago');
    xml.text('COD');
    xml.endElement('nb_fpago');
    xml.startElement('url');
    xml.startElement('reference');
    xml.text(matricula + '_1');
    xml.endElement('reference');
    xml.startElement('amount');
    xml.text(monto);
    xml.endElement('amount');
    xml.startElement('moneda');
    xml.text('MXN');
    xml.endElement('moneda');
    xml.startElement('canal');
    xml.text('W');
    xml.endElement('canal');
    xml.startElement('omitir_notif_default');
    xml.text('1');
    xml.endElement('omitir_notif_default');
    xml.startElement('version');
    xml.text('IntegraWPP');
    xml.endElement('version');
    xml.endElement('url');
    xml.endElement('P');
    xml.endDocument();

    // Pones todo el xml en un string
    let originalString = xml.toString();

    let key = '5DCC67393750523CD165F17E1EFADD21';

    console.log(originalString);

    // Lo cifras con las funciones del github de documentación
    let cipherText = cipher.cifrarAES(originalString, key);

    // Creas otro xml para hacer el post con el texto cifrado
    let originalString_post = "xml=<pgs><data0>SNDBX123</data0><data>" + cipherText + "</data></pgs>";
    let data_xml = encodeURIComponent(originalString_post);

    // Haces el post del xml generado
    axios.post('https://sandboxpo.mit.com.mx/gen', data_xml, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
    }).then(function (xml_response) {
        // Esperas la respuesta cifrada
        let responseText = xml_response.data;
        let decipherText = cipher.decifrarAES(responseText, key);

        return response.status(200).json({
            success: true,
            respuestaXML: decipherText,
            matricula: matricula,
        });
    }).catch((error) => {
        console.log(error);
    })
};

exports.get_recibir_pago = async (request, response, next) => {
    // Obtén los parámetros de la URL
    var params = request.query;

    // Aquí puedes procesar los parámetros según tus necesidades.
    // Por ejemplo, puedes verificar si el pago fue exitoso, registrar la transacción en tu base de datos, etc.

    // Renderiza la vista 'miVista.ejs' y pasa los datos que quieres mostrar
    response.render('pago/recibir_pago', {
        params: params,
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
}

exports.post_respuesta_pago = async (request, response, next) => {

    let test = request.body.test;
    let monto = request.body.monto;

    let mail = await Usuario.fetchCorreo(request.body.matricula);

    let correo = mail[0][0].correoElectronico

    console.log(test, monto, correo)

    if (test === 0) {
        response.redirect(`http://localhost:4000/pagos/recibir_pago?&success=true&nuAut=0SNBX1&operacion=100000551635&fecha=01%2F05%2F24%209%3A7%3A4&banco=BANCO+MIT&marca=MasterCard&tpTdc=C&nb_merchant=1234567&nbResponse=Aprobado&sucursal=01SNBXBRNCH&empresa=SANDBOX+WEBPAY&importe=${monto}&referencia=MIFACTURA001&referenciaPayment=MIFACTURA001&nbMoneda=MXN&cdEmpresa=SNBX&urlTokenId=SNDBX001&idLiga=SNDBX001&email=${correo}`);
    }

    if (test === 1) {
        response.redirect(`http://localhost:4000/pagos/recibir_pago?&success=true&nbResponse=Rechazado&cdResponse=Transaccion+declinada&nb_error=La+transaccion+ya+fue+aprobada+el+30%2F04%2F24%2020%3A42%3A53&sucursal=01SNBXBRNCH&empresa=SANDBOX+WEBPAY&importe=${monto}&referencia=MIFACTURA001&referenciaPayment=MIFACTURA001&nbMoneda=MXN&cdEmpresa=SNBX&urlTokenId=SNDBX001&idLiga=SNDBX001&email=${correo}`);
    }

    if (test === 2) {
        response.redirect(`http://localhost:4000/pagos/recibir_pago`);
    }
};



const xml2js = require('xml2js');

exports.post_recibir_pago = async (request, response, next) => {

    let test = request.body.test;
    let motivo = request.body.motivo;
    let matricula = request.body.matricula;
    let matriculaComoCadena = matricula.toString();
    let primerNumero = matriculaComoCadena.charAt(0);
    let IDdeuda = request.body.deuda;
    let liquida = request.body.liquida;
    let monto = request.body.monto;
    let nota = request.body.nota;
    let tipo = request.body.tipo;
    let status = '';
    let date = '';
    let fecha = '';
    let fechaUsar = '';

    if (test === 0) {
        const strResponse = decodeURIComponent("yO3hhCLQmgOr2R6j1WHzb5S5IL5raWDL4zSTFIc6VcZOEGQXi4SFK5EDATyDAHQZalBxRhZDJZ46FAFpltJ95CCo59pYVDqpFjmIcqePs4FiUx3BEcRkrjVeqwUyJUILxtlLBOgm9YbYqT%2F%2Fbe8nYCW8sj%2FOH%2BIvXKcxojy%2BljqlZn4Mqi1dsStM%2FSCQa%2BSFLOJ%2FJXcSuAjhu7i7Sj%2BNxrqB5mAicNlZ3SoZv2z3MULe9MIuyzgYNg6bUC%2BCHMRiujhoUXOs55gts7kAVdEasRiNl0LFWw8neGCB%2FYKWk6n3Xw2moBrIylqGI6yM1p49c2fQBs6FHsGKWtc%2BkP9nbWBy25HtrnWdQmgXbanJV4MoXqivlhrOSkDFi0qYzVzI%2BlhYLGYq6zF23u%2BIhsM4szG1qiMocOymkTrqWU7Ns7WWqCzYYX1N3WUVIzpFiJKKJ4gymbIwbvBel5HKy6ZUDxgvpPLGLl1KfzuhNzYg%2F%2FklGpEDxPmZf9km0exPcSKJQGphpj%2BW8LH3Jo0BqIE6qRW434E6LLbmyGyd8AOHlQX%2BZ2a17VBkTR%2BqDz6Ca%2FEwf0aMaDQIQam5zIrqHzL5xPwQgXl0RH66IUM%2FeSpE4h2PeTPY11qEL7Pvyf5bXbuCGFss4GPT0Mj7OiSq6x%2FgHNWjFiHLzPXqOita%2B1PXQu5VNO2VAjZMCSK6XU1LQELDdo4MUtBB6%2BCU16gz5vc6F%2FSwtllu3tbMB4jNGjk6Y9kvvg%2BoHCWSmI2mX0JHDySajJC23tOHW2vO1D%2B9xsM2k%2BwQ8f9xjKjeIXkA2qoPHlgUfDavufWKTyuGWutGKZCCPvvFRTHJoUxpbMYTZQo%2BArsczE4IYkSIHk2FUVDTfRddpuOuoLdBXJQPSHxIruv4OcvsXQnEuknd06zdGYEgM0eyMWfMaSaWIuKJFzuf9p3mQznV8OXA%2F1aNyCOsh90AvHt%2FOPKOi1xwrQU7d9iiNiufr%2FzE4lp%2FmWY6s6TQbZAAyphkqxfwmeNg6Ogsg9hq48RP%2FwjyFdnZwplF8GBgFARBWhy22d8r8vGWVijbYbRYcBnWNtF1GTmWsET7lEzXJfGODOLSZoEQUn%2Fw2%2BfIl4kPx%2F0ycK7yeXC39zpj04hf3bTFuYchz%2BKjzuvHYeDE");

        let key = '5DCC67393750523CD165F17E1EFADD21';
        const responseText = cipher.decifrarAES(strResponse, key);

        xml2js.parseString(responseText, (err, result) => {
            if (err) {
                throw err;
            }
            // Accede a cada campo del XML y guárdalo en una variable
            status = result.CENTEROFPAYMENTS.response[0];

            if (result.CENTEROFPAYMENTS == null || result.CENTEROFPAYMENTS.date == null || result.CENTEROFPAYMENTS.time == null || result.CENTEROFPAYMENTS.amount == null) {
                let currentdate = new Date();
                let datetime = currentdate.getFullYear() + "-"
                    + (currentdate.getMonth() + 1) + "-"
                    + currentdate.getDate() + " "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();
                fecha = datetime;
                monto = 0;
            }
            else {
                importe = result.CENTEROFPAYMENTS.amount[0];
                date = result.CENTEROFPAYMENTS.date[0];
                time = result.CENTEROFPAYMENTS.time[0];

                let adjustedTime = time.split(':').map(unit => unit.padStart(2, '0')).join(':');
                let adjustedDate = date.split('/').map(unit => unit.padStart(2, '0')).join('/');

                let fecha = adjustedDate + adjustedTime;

                // Usamos una expresión regular para separar las partes de la fecha y la hora
                let parts = fecha.match(/(\d{2})\/(\d{2})\/(\d{2})(\d{2}):(\d{2}):(\d{2})/);

                // Reorganizamos las partes en el formato que queremos
                let formattedDate = moment(`${parts[3]}/${parts[2]}/${parts[1]} ${parts[4]}:${parts[5]}:${parts[6]}`, 'YY/MM/DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

                // Convertimos la fecha formateada a un objeto Date de JavaScript
                let dateObject = new Date(formattedDate);

                fechaUsar = moment(dateObject).format('YYYY-MM-DD HH:mm:ss')
            }
        });

        if (status === 'approved') {
            if (tipo === 'Normal') {
                if (primerNumero === '1') {
                    let IDColegiatura = await Colegiatura.fetchColegiaturaActiva(matricula);
                    let IDCol = IDColegiatura[0][0].IDColegiatura;
                    console.log("Es un pago de colegiatura aceptado")
                    Deuda.fetchNoPagadas(IDCol)
                        .then(async ([deudas_noPagadas, fieldData]) => {
                            // Guardas el pago completo del alumno
                            await Pago.save_tarjeta(IDdeuda, motivo, monto, nota, fechaUsar);

                            for (let deuda of deudas_noPagadas) {
                                if (monto <= 0) {
                                    break;
                                } else if ((deuda.montoAPagar - deuda.montoPagado) < monto) {
                                    // Como el monto a usar el mayor que la deuda, subes lo que deben a esa deuda
                                    await Deuda.update_Deuda((deuda.montoAPagar - deuda.montoPagado), IDdeuda);
                                    await Colegiatura.update_Colegiatura((deuda.montoAPagar - deuda.montoPagado), IDCol);
                                } else if ((deuda.montoAPagar - deuda.montoPagado) >= monto) {
                                    // Como el monto a usar es menor, se usa monto a usar (lo que resto)
                                    await Deuda.update_Deuda(monto, IDdeuda);
                                    await Colegiatura.update_Colegiatura(monto, IDCol);
                                }

                                // Le restas al monto_a_usar lo que acabas de pagar para que la deuda se vaya restando
                                monto = monto - deuda.montoAPagar;
                            }

                            // Si el monto a usar es positivo despues de recorrer las deudas, agregar ese monto a credito
                            if (monto > 0) {
                                await Alumno.update_credito(matricula, monto);
                            }
                        })
                }

                else if (primerNumero === '8') {
                    console.log("Es un pago de diplomado aceptado")
                    const IDDiplomado = await Cursa.fetchDiplomado(matricula);
                    await PagoDiplomado.save_tarjeta(matricula, IDDiplomado[0][0].IDDiplomado, fechaUsar, monto, motivo, nota);
                }
            }

            else if (tipo === 'Otro') {
                console.log("Es un pago extra exitoso")
                await Liquida.updateExitoso(nota, fechaUsar, liquida);
            }
        }

        else if (status === 'denied') {
            if (tipo === 'Normal') {
                if (primerNumero === '1') {
                    console.log("Es un pago de colegiatura denegado")
                    await Pago.save_tarjeta(IDdeuda, motivo, 0, 'PAGO DECLINADO', fecha);
                }
                else if (primerNumero === '8') {
                    console.log("Es un pago de diplomado denegado")
                    const IDDiplomado = await Cursa.fetchDiplomado(matricula);
                    await PagoDiplomado.save_tarjeta(matricula, IDDiplomado[0][0].IDDiplomado, fecha, 0, monto, 'PAGO DECLINADO');
                }
            }

            else if (tipo === 'Otro') {
                console.log("Es un pago extra denegado")
                await Liquida.updateDeclinado('PAGO DECLINADO', fecha, liquida);
            }
        }


        else if (status === 'error') {
            if (tipo === 'Normal') {
                if (primerNumero === '1') {
                    console.log("Es un pago de colegiatura con error")
                    await Pago.save_tarjeta(IDdeuda, motivo, 0, 'PAGO CON ERROR', fecha);

                }

                else if (primerNumero === '8') {
                    console.log("Es un pago de diplomado con error")
                    const IDDiplomado = await Cursa.fetchDiplomado(matricula);
                    await PagoDiplomado.save_tarjeta(matricula, IDDiplomado[0][0].IDDiplomado, fecha, 0, monto, 'PAGO CON ERROR');
                }
            }

            else if (tipo === 'Otro') {
                console.log("Es un pago extra con error")
                await Liquida.updateDeclinado('PAGO CON ERROR', fecha, liquida);
            }
        }

        return response.status(200).json({ responseText });
    }

    if (test === 1) {
        const strResponse = decodeURIComponent("1M%2BEqIz5aMtiQWqSbVQShPjLz56DP6NUmEPBX%2BfGwMj3yG8M7UCFN4LloN1Kd3vCdsluXmukuB4%2F3wJz%2FZUj55Bry8vuhx4oi5WHzNL78G0kZeV2EpexWoDOQ%2FKeeb0nlTnKbZk70AJo9BACRUE7b3aYGs006rJmCbpkny2WaTGW1hKK5RMSz%2BdDi%2ByEiAuUp7Wx8zkBXwbur9Siz7%2FG8i8X3uQVeA0wuvrK2KjD43NT6JTZxmUKLnnmmJcIUoRPuK6XdSGyweSXEXswtQwImEv4wnxaCXUTRaHZ7pGYFIuhJadoWIIwN52CaM5H7Hpvx0klsbKAyOarX%2BwYwKd9ihzK4c7GHc0tp936k41A2y8dL6nJTvMu%2Bh03oJjetkbSjt1ijxZK6%2Bz7CTjmgxSfPYS5X9r6sWwSf4eHkzSI99DkrAM%2BZkC%2F7GkaHtlE6sJkq7JsbG0Am%2Fdj%2FL7VVhSyqvTAbZ2OLKGNhaf7yQ11KJ0exh%2FVWWDBFAL5m0Zv88qFRlwJDkXH7xu1DM9WnAbB0owGJ%2FoquH5Mr0G8P7HZM7wdGyw878N%2FFvaclsPgjcc9fjoXlfxYEMP4hz92nJrDrA%3D%3D");

        let key = '5DCC67393750523CD165F17E1EFADD21';
        const responseText = cipher.decifrarAES(strResponse, key);

        xml2js.parseString(responseText, (err, result) => {
            if (err) {
                throw err;
            }

            // Accede a cada campo del XML y guárdalo en una variable
            status = result.CENTEROFPAYMENTS.response[0];

            console.log(status);

            if (result.CENTEROFPAYMENTS == null || result.CENTEROFPAYMENTS.date == null || result.CENTEROFPAYMENTS.time == null || result.CENTEROFPAYMENTS.amount == null) {
                let currentdate = new Date();
                let datetime = currentdate.getFullYear() + "-"
                    + (currentdate.getMonth() + 1) + "-"
                    + currentdate.getDate() + " "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();
                fecha = datetime;
                monto = 0;
            }
            else {
                importe = result.CENTEROFPAYMENTS.amount[0];
                date = result.CENTEROFPAYMENTS.date[0];
                time = result.CENTEROFPAYMENTS.time[0];

                let adjustedTime = time.split(':').map(unit => unit.padStart(2, '0')).join(':');
                let adjustedDate = date.split('/').map(unit => unit.padStart(2, '0')).join('/');

                let fecha = adjustedDate + adjustedTime;

                // Usamos una expresión regular para separar las partes de la fecha y la hora
                let parts = fecha.match(/(\d{2})\/(\d{2})\/(\d{2})(\d{2}):(\d{2}):(\d{2})/);

                // Reorganizamos las partes en el formato que queremos
                let formattedDate = moment(`${parts[3]}/${parts[2]}/${parts[1]} ${parts[4]}:${parts[5]}:${parts[6]}`, 'YY/MM/DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

                // Convertimos la fecha formateada a un objeto Date de JavaScript
                let dateObject = new Date(formattedDate);

                fechaUsar = moment(dateObject).format('YYYY-MM-DD HH:mm:ss')
            }
        });

        if (status === 'approved') {
            if (tipo === 'Normal') {
                if (primerNumero === '1') {
                    let IDColegiatura = await Colegiatura.fetchColegiaturaActiva(matricula);
                    let IDCol = IDColegiatura[0][0].IDColegiatura;
                    console.log("Es un pago de colegiatura aceptado")
                    Deuda.fetchNoPagadas(IDCol)
                        .then(async ([deudas_noPagadas, fieldData]) => {
                            // Guardas el pago completo del alumno
                            await Pago.save_tarjeta(IDdeuda, motivo, monto, nota, fechaUsar);

                            for (let deuda of deudas_noPagadas) {
                                if (monto <= 0) {
                                    break;
                                } else if ((deuda.montoAPagar - deuda.montoPagado) < monto) {
                                    // Como el monto a usar el mayor que la deuda, subes lo que deben a esa deuda
                                    await Deuda.update_Deuda((deuda.montoAPagar - deuda.montoPagado), IDdeuda);
                                    await Colegiatura.update_Colegiatura((deuda.montoAPagar - deuda.montoPagado), IDCol);
                                } else if ((deuda.montoAPagar - deuda.montoPagado) >= monto) {
                                    // Como el monto a usar es menor, se usa monto a usar (lo que resto)
                                    await Deuda.update_Deuda(monto, IDdeuda);
                                    await Colegiatura.update_Colegiatura(monto, IDCol);
                                }

                                // Le restas al monto_a_usar lo que acabas de pagar para que la deuda se vaya restando
                                monto = monto - deuda.montoAPagar;
                            }

                            // Si el monto a usar es positivo despues de recorrer las deudas, agregar ese monto a credito
                            if (monto > 0) {
                                await Alumno.update_credito(matricula, monto);
                            }
                        })
                }

                else if (primerNumero === '8') {
                    console.log("Es un pago de diplomado aceptado")
                    const IDDiplomado = await Cursa.fetchDiplomado(matricula);
                    await PagoDiplomado.save_tarjeta(matricula, IDDiplomado[0][0].IDDiplomado, fechaUsar, monto, motivo, nota);
                }
            }

            else if (tipo === 'Otro') {
                console.log("Es un pago extra exitoso")
                await Liquida.updateExitoso(nota, fechaUsar, liquida);
            }
        }

        else if (status === 'denied') {
            if (tipo === 'Normal') {
                if (primerNumero === '1') {
                    console.log("Es un pago de colegiatura denegado")
                    await Pago.save_tarjeta(IDdeuda, motivo, 0, 'PAGO DECLINADO', fecha);
                }
                else if (primerNumero === '8') {
                    console.log("Es un pago de diplomado denegado")
                    const IDDiplomado = await Cursa.fetchDiplomado(matricula);
                    await PagoDiplomado.save_tarjeta(matricula, IDDiplomado[0][0].IDDiplomado, fecha, 0, monto, 'PAGO DECLINADO');
                }
            }

            else if (tipo === 'Otro') {
                console.log("Es un pago extra denegado")
                await Liquida.updateDeclinado('PAGO DECLINADO', fecha, liquida);
            }
        }


        else if (status === 'error') {
            if (tipo === 'Normal') {
                if (primerNumero === '1') {
                    console.log("Es un pago de colegiatura con error")
                    await Pago.save_tarjeta(IDdeuda, motivo, 0, 'PAGO CON ERROR', fecha);

                }

                else if (primerNumero === '8') {
                    console.log("Es un pago de diplomado con error")
                    const IDDiplomado = await Cursa.fetchDiplomado(matricula);
                    await PagoDiplomado.save_tarjeta(matricula, IDDiplomado[0][0].IDDiplomado, fecha, 0, monto, 'PAGO CON ERROR');
                }
            }

            else if (tipo === 'Otro') {
                console.log("Es un pago extra con error")
                await Liquida.updateDeclinado('PAGO CON ERROR', fecha, liquida);
            }
        }

        return response.status(200).json({ responseText });
    }





    if (test === 2) {
        const strResponse = decodeURIComponent("eZqdj8MWWqMlWJ3bKlTi3C1GJGRNHSf%2BtGAUZ8S92ts2ETnaLAKnrIBhQKNQxNyYrwIQHEUJl6BolhMLRizPqDlUQ6HZnMj3VTrdwsIw2ox0Jlp6X0mI1uWFNheCysZAqWE9oRlaebL2oU6GmMv%2BXzVQhHUoN0Lt2ON3ujJ1KB5lmMri5%2FPasmVncQPbkG8Op%2F8hbggsT50CQA8Q0MU%2FM3eAgicyqIGP6JCmfREmXGGTRxlK7x%2BZGj5tX5fqEYgjo1mq4BwzMF%2FeWyBi5otNz%2FwINU2lf7cuZkJo1%2FUohYMcfCSyty3eUZFJ9zQdCuJqjVY1vhJ5qICy0G2FE5uiAP4ihJN%2Foq2iGxzPEdBi401zjWUbIXa69V18GPdShPn1%2BPbDPr47N%2BDUtivsvyeaoZ5QOX6d81E7KvLcIh5DOLemQ82crJ%2FH4kRtMI8AdX3MwL82DK%2FSP6hPb%2FPFjwxyD1YOB4CWYnzIAUgBxHRT7dYSb0e5V%2FYrXdaCEjqAfRNz");

        let key = '5DCC67393750523CD165F17E1EFADD21';
        const responseText = cipher.decifrarAES(strResponse, key);

        xml2js.parseString(responseText, (err, result) => {
            if (err) {
                throw err;
            }

            // Accede a cada campo del XML y guárdalo en una variable
            status = result.CENTEROFPAYMENTS.response[0];

            console.log(status);

            if (result.CENTEROFPAYMENTS == null || result.CENTEROFPAYMENTS.date == null || result.CENTEROFPAYMENTS.time == null || result.CENTEROFPAYMENTS.amount == null) {
                let currentdate = new Date();
                let datetime = currentdate.getFullYear() + "-"
                    + (currentdate.getMonth() + 1) + "-"
                    + currentdate.getDate() + " "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();
                fecha = datetime;
                importe = 0;
            }
            else {
                importe = result.CENTEROFPAYMENTS.amount[0];
                date = result.CENTEROFPAYMENTS.date[0];
                time = result.CENTEROFPAYMENTS.time[0];

                let adjustedTime = time.split(':').map(unit => unit.padStart(2, '0')).join(':');
                let adjustedDate = date.split('/').map(unit => unit.padStart(2, '0')).join('/');

                let fecha = adjustedDate + adjustedTime;

                // Usamos una expresión regular para separar las partes de la fecha y la hora
                let parts = fecha.match(/(\d{2})\/(\d{2})\/(\d{2})(\d{2}):(\d{2}):(\d{2})/);

                // Reorganizamos las partes en el formato que queremos
                let formattedDate = moment(`${parts[3]}/${parts[2]}/${parts[1]} ${parts[4]}:${parts[5]}:${parts[6]}`, 'YY/MM/DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

                // Convertimos la fecha formateada a un objeto Date de JavaScript
                let dateObject = new Date(formattedDate);

                fechaUsar = moment(dateObject).format('YYYY-MM-DD HH:mm:ss')
            }
        });

        if (status === 'approved') {
            if (tipo === 'Normal') {
                if (primerNumero === '1') {
                    let IDColegiatura = await Colegiatura.fetchColegiaturaActiva(matricula);
                    let IDCol = IDColegiatura[0][0].IDColegiatura;
                    console.log("Es un pago de colegiatura aceptado")
                    Deuda.fetchNoPagadas(IDCol)
                        .then(async ([deudas_noPagadas, fieldData]) => {
                            // Guardas el pago completo del alumno
                            await Pago.save_tarjeta(IDdeuda, motivo, monto, nota, fechaUsar);

                            for (let deuda of deudas_noPagadas) {
                                if (monto <= 0) {
                                    break;
                                } else if ((deuda.montoAPagar - deuda.montoPagado) < monto) {
                                    // Como el monto a usar el mayor que la deuda, subes lo que deben a esa deuda
                                    await Deuda.update_Deuda((deuda.montoAPagar - deuda.montoPagado), IDdeuda);
                                    await Colegiatura.update_Colegiatura((deuda.montoAPagar - deuda.montoPagado), IDCol);
                                } else if ((deuda.montoAPagar - deuda.montoPagado) >= monto) {
                                    // Como el monto a usar es menor, se usa monto a usar (lo que resto)
                                    await Deuda.update_Deuda(monto, IDdeuda);
                                    await Colegiatura.update_Colegiatura(monto, IDCol);
                                }

                                // Le restas al monto_a_usar lo que acabas de pagar para que la deuda se vaya restando
                                monto = monto - deuda.montoAPagar;
                            }

                            // Si el monto a usar es positivo despues de recorrer las deudas, agregar ese monto a credito
                            if (monto > 0) {
                                await Alumno.update_credito(matricula, monto);
                            }
                        })
                }

                else if (primerNumero === '8') {
                    console.log("Es un pago de diplomado aceptado")
                    const IDDiplomado = await Cursa.fetchDiplomado(matricula);
                    await PagoDiplomado.save_tarjeta(matricula, IDDiplomado[0][0].IDDiplomado, fechaUsar, monto, motivo, nota);
                }
            }

            else if (tipo === 'Otro') {
                console.log("Es un pago extra exitoso")
                await Liquida.updateExitoso(nota, fechaUsar, liquida);
            }
        }

        else if (status === 'denied') {
            if (tipo === 'Normal') {
                if (primerNumero === '1') {
                    console.log("Es un pago de colegiatura denegado")
                    await Pago.save_tarjeta(IDdeuda, motivo, 0, 'PAGO DECLINADO', fecha);
                }
                else if (primerNumero === '8') {
                    console.log("Es un pago de diplomado denegado")
                    const IDDiplomado = await Cursa.fetchDiplomado(matricula);
                    await PagoDiplomado.save_tarjeta(matricula, IDDiplomado[0][0].IDDiplomado, fecha, 0, monto, 'PAGO DECLINADO');
                }
            }

            else if (tipo === 'Otro') {
                console.log("Es un pago extra denegado")
                await Liquida.updateDeclinado('PAGO DECLINADO', fecha, liquida);
            }
        }


        else if (status === 'error') {
            if (tipo === 'Normal') {
                if (primerNumero === '1') {
                    console.log("Es un pago de colegiatura con error")
                    await Pago.save_tarjeta(IDdeuda, motivo, 0, 'PAGO CON ERROR', fecha);

                }

                else if (primerNumero === '8') {
                    console.log("Es un pago de diplomado con error")
                    const IDDiplomado = await Cursa.fetchDiplomado(matricula);
                    await PagoDiplomado.save_tarjeta(matricula, IDDiplomado[0][0].IDDiplomado, fecha, 0, monto, 'PAGO CON ERROR');
                }
            }

            else if (tipo === 'Otro') {
                console.log("Es un pago extra con error")
                await Liquida.updateDeclinado('PAGO CON ERROR', fecha, liquida);
            }
        }

        return response.status(200).json({ responseText });
    }

}