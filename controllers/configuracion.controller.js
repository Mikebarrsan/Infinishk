const PlanPago = require('../models/planpago.model');
const PrecioCredito = require('../models/precio_credito.model');
const Usuario = require('../models/usuario.model');
const Rol = require('../models/rol.model');
const Posee = require('../models/posee.model');
const Alumno = require('../models/alumno.model');
const estudianteDiplomado = require('../models/estudianteDiplomado.model');
const Diplomado = require('../models/diplomado.model');

const {
    getAllUsers,
    getAllCourses,
    getAllPeriods,
    getUser,
    getAllAdmins
} = require('../util/adminApiClient');

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const jwt = require('jsonwebtoken');

const config = require('../config');

// Usar la clave secreta en tu código
const secretKey = config.jwtSecret;

// Configuras a moment con el locale. 
const moment = require('moment-timezone');
const rol = require('../models/rol.model');
moment.locale('es-mx');

exports.get_administrar_planpago = (request, response, next) => {
    PlanPago.fetchAll()
        .then(([planpagos]) => {
            response.render('configuracion/administrar_planpago', {
                planpago: planpagos,
                csrfToken: request.csrfToken(),
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.get_consultar_usuario = (request, response, next) => {
    Usuario.fetchActivos()
        .then(([usuariosActivos, fieldData]) => {
            Usuario.fetchNoActivos()
                .then(([usuariosNoActivos, fieldData]) => {
                    response.render('configuracion/consultar_usuario', {
                        usuariosNoActivos: usuariosNoActivos,
                        usuariosActivos: usuariosActivos,
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        csrfToken: request.csrfToken()
                    })
                })
                .catch((error) => {
                    console.log(error)
                });
        })
        .catch((error) => {
            console.log(error)
        });
};

exports.get_registrar_usuario = (request, response, next) => {
    Rol.fetchAll()
        .then(([roles_disponibles, fieldData]) => {
            response.render('configuracion/registrar_usuario', {
                roles_disponibles: roles_disponibles,
                csrfToken: request.csrfToken(),
                error: false,
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            })
        })
        .catch((error) => {
            console.log(error)
        })
};


exports.post_registrar_usuario = async (request, response, next) => {
    const [roles_disponibles, fieldData] = await Rol.fetchAll()

    const rol = request.body.roles;
    const matricula = request.body.IDUsuario_NoAlumno;
    const correo = request.body.correoElectronico_NoAlumno;


    if (rol === 'Administrador') {

        const [usuarioExistente, fieldData] = await Usuario.fetchOne(matricula);
        if (usuarioExistente.length > 0) {
            return response.render('configuracion/registrar_usuario', {
                roles_disponibles: roles_disponibles,
                csrfToken: request.csrfToken(),
                error: true,
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            })
        }

        await Usuario.saveUsuario(matricula, correo);
        await Posee.savePosee(matricula, 1);

        const token_noAlumno = jwt.sign({
            matricula: matricula
        }, secretKey, {
            expiresIn: '3d'
        });

        // Enlace con el token incluido
        const setPasswordLinkNoAlumno = `http://localhost:4000/auth/set_password?token=${token_noAlumno}`;

        const msg_noAlumno = {
            to: correo,
            from: {
                name: 'VIA PAGO',
                email: '27miguelb11@gmail.com',
            },
            subject: 'Bienvenido a VIA Pago',
            html: `<p>Hola!</p><p>Haz clic en el siguiente enlace para establecer tu contraseña. Toma en cuenta que la liga tiene una validez de 3 días: <a href="${setPasswordLinkNoAlumno}">Establecer Contraseña</a></p>`
        };

        try {
            await sgMail.send(msg_noAlumno);
            console.log('Correo electrónico enviado correctamente');
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error.toString());
        };
    }

    if (rol === 'Visualizador') {

        const [usuarioExistente, fieldData] = await Usuario.fetchOne(matricula);
        if (usuarioExistente.length > 0) {
            return response.render('configuracion/registrar_usuario', {
                roles_disponibles: roles_disponibles,
                csrfToken: request.csrfToken(),
                error: true,
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            })
        }

        await Usuario.saveUsuario(matricula, correo);
        await Posee.savePosee(matricula, 2);

        const token_noAlumno = jwt.sign({
            matricula: matricula
        }, secretKey, {
            expiresIn: '3d'
        });

        // Enlace con el token incluido
        const setPasswordLinkNoAlumno = `http://localhost:4000/auth/set_password?token=${token_noAlumno}`;

        const msg_noAlumno = {
            to: correo,
            from: {
                name: 'VIA PAGO',
                email: '27miguelb11@gmail.com',
            },
            subject: 'Bienvenido a VIA Pago',
            html: `<p>Hola!</p><p>Haz clic en el siguiente enlace para establecer tu contraseña. Toma en cuenta que la liga tiene una validez de 3 días: <a href="${setPasswordLinkNoAlumno}">Establecer Contraseña</a></p>`
        };

        try {
            await sgMail.send(msg_noAlumno);
            console.log('Correo electrónico enviado correctamente');
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error.toString());
        };
    }

    if (rol === 'Alumno') {

        const matricula_alumno = request.body.IDUsuario;
        const correo_alumno = request.body.correoElectronico;
        const nombre = request.body.nombre;
        const apellidos = request.body.apellidos;
        const referenciaBancaria = request.body.referenciaBancaria;
        const fechaInscripcion = request.body.fechaInscripcion.split("/").reverse().join("-");
        const fechaModificacion = fechaInscripcion + ' 08:00:00';

        const [usuarioExistente, fieldData] = await Usuario.fetchOne(matricula_alumno);
        if (usuarioExistente.length > 0) {
            return response.render('configuracion/registrar_usuario', {
                roles_disponibles: roles_disponibles,
                csrfToken: request.csrfToken(),
                error: true,
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            })
        };

        // Registras al usuario y al alumno
        await Usuario.saveUsuario(matricula_alumno, correo_alumno);
        await Posee.savePosee(matricula_alumno, 3);
        await Alumno.save_alumno(matricula_alumno, nombre, apellidos, referenciaBancaria);

        // Registras al estudiante en diplomado
        const estudiante = new estudianteDiplomado(matricula_alumno, fechaModificacion);
        await estudiante.save();

        const token_noAlumno = jwt.sign({
            matricula: matricula
        }, secretKey, {
            expiresIn: '3d'
        });

        // Enlace con el token incluido
        const setPasswordLinkNoAlumno = `http://localhost:4000/auth/set_password?token=${token_noAlumno}`;

        const msgAlumno = {
            to: correo_alumno,
            from: {
                name: 'VIA PAGO',
                email: '27miguelb11@gmail.com',
            },
            subject: 'Bienvenido a VIA Pago',
            html: `<p>Hola!</p><p>Haz clic en el siguiente enlace para establecer tu contraseña. Toma en cuenta que la liga tiene una validez de 3 días: <a href="${setPasswordLinkNoAlumno}">Establecer Contraseña</a></p>`
        };

        try {
            await sgMail.send(msgAlumno);
            console.log('Correo electrónico enviado correctamente');
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error.toString());
        }
    }

    response.redirect('/configuracion/consultar_usuario');
};

exports.get_obtener_usuario = (request, response, next) => {
    response.render('configuracion/obtener_usuario', {
        error: false,
        errorMensaje: '',
        csrfToken: request.csrfToken(),
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    })
}

exports.post_getAdmins = async (request, response, next) => {
    let input = request.body.input;
    try {
        const users = await getAllAdmins();

        let unregisteredAdmins = [];
        let registeredAdmins = [];

        for (let count = 0; count < users.data.length; count++) {
            let admin_matricula = (users.data[count].ivd_id).toString()
            let [usuarioExistente, fieldData] = await Usuario.fetchOne(admin_matricula);

            if (usuarioExistente.length == 0) {
                unregisteredAdmins.push(admin_matricula)
            }
        }

        // Filtras dependiendo del user input
        function filterArray(userInput) {
            return unregisteredAdmins.filter(number => number.includes(userInput));
        }

        // llamas la función con el input
        const filteredResults = filterArray(input);

        // Sacas si existe un usuario con el input
        let [usuarioExistente, fieldData] = await Usuario.fetchOne(input);

        let usuarioExist = JSON.stringify(usuarioExistente);

        if (usuarioExist.length != 2) {
            registeredAdmins.push(input)
        }

        return response.status(200).json({
            admins: filteredResults,
            registered: registeredAdmins
        });

    } catch (error) {
        console.log(error);
    }
};

exports.post_obtener_usuario = async (request, response, next) => {
    const matricula = request.body.user;
    const roles = await Rol.fetchNotAll();
    const roles_disponibles = roles[0].map(rol => rol.nombreRol);

    try {
        const user = await getUser(matricula);

        const usuarios = {
            ivd_id: user.data.ivd_id || '',
            email: user.data.email || '',
        }

        response.render('configuracion/activar_usuario', {
            usuarios: usuarios,
            roles_disponibles: roles_disponibles,
            csrfToken: request.csrfToken(),
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
        })

    } catch (error) {
        console.log(error);
        response.redirect('/configuracion/consultar_usuario')
    }
}

exports.post_activar_usuario = async (request, response, next) => {
    const rol = request.body.roles;
    const matricula = request.body.matricula;
    const correo = request.body.correo;

    if (rol === 'Administrador') {
        await Usuario.saveUsuario(matricula, correo);
        await Posee.savePosee(matricula, 1);

        const token = jwt.sign({ matricula: matricula }, secretKey, { expiresIn: '3d' });

        // Enlace con el token incluido
        const setPasswordLink = `http://localhost:4000/auth/set_password?token=${token}`;

        const msg = {
            to: correo,
            from: {
                name: 'VIA PAGO',
                email: '27miguelb11@gmail.com',
            },
            subject: 'Bienvenido a VIA Pago',
            html: `<p>Hola!</p><p>Haz clic en el siguiente enlace para establecer tu contraseña. Toma en cuenta que la liga tiene una validez de 3 días: <a href="${setPasswordLink}">Establecer Contraseña</a></p>`
        };

        try {
            await sgMail.send(msg);
            console.log('Correo electrónico enviado correctamente');
        }
        catch (error) {
            console.error('Error al enviar el correo electrónico:', error.toString());
        }

        response.redirect('/configuracion/consultar_usuario')

    }

    if (rol === 'Visualizador') {
        await Usuario.saveUsuario(matricula, correo);
        await Posee.savePosee(matricula, 2);

        const token = jwt.sign({ matricula: matricula }, secretKey, { expiresIn: '3d' });

        // Enlace con el token incluido
        const setPasswordLink = `http://localhost:4000/auth/set_password?token=${token}`;

        const msg = {
            to: correo,
            from: {
                name: 'VIA PAGO',
                email: '27miguelb11@gmail.com',
            },
            subject: 'Bienvenido a VIA Pago',
            html: `<p>Hola!</p><p>Haz clic en el siguiente enlace para establecer tu contraseña. Toma en cuenta que la liga tiene una validez de 3 días: <a href="${setPasswordLink}">Establecer Contraseña</a></p>`
        };

        try {
            await sgMail.send(msg);
            console.log('Correo electrónico enviado correctamente');
        }
        catch (error) {
            console.error('Error al enviar el correo electrónico:', error.toString());
        }

        response.redirect('/configuracion/consultar_usuario');

    }
};

exports.get_search_activo = (request, response, next) => {
    const consulta = request.query.q;
    console.log('Consulta recibida:', consulta); // Verifica si la consulta se está recibiendo correctamente
    Usuario.buscar(consulta) // Búsqueda de usuarios
        .then(([usuarios]) => {
            response.json(usuarios);
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.get_search_noactivo = (request, response, next) => {
    const consulta = request.query.q;
    console.log('Consulta recibida:', consulta); // Verifica si la consulta se está recibiendo correctamente
    Usuario.buscarNoActivos(consulta)// Búsqueda de usuarios
        .then(([usuarios]) => {
            response.json(usuarios);
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.get_precio_credito = (request, response, next) => {
    PrecioCredito.fetchPrecioActual()
        .then((precio_actual) => {
            PrecioCredito.fetchAnios()
                .then(([anios, fieldData]) => {
                    response.render('configuracion/precio_credito', {
                        precio_actual: precio_actual[0],
                        anios: anios,
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        csrfToken: request.csrfToken()
                    })
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            console.log(error)
        });
};

exports.post_precio_credito = (request, response, next) => {
    const anioSelect = request.body.anio;
    PrecioCredito.fetchPrecioAnio(anioSelect)
        .then(([precio_anio, fieldData]) => {
            // Conviertes las fechas a tu zona horaria con moment
            for (let count = 0; count < precio_anio.length; count++) {
                precio_anio[count].fechaModificacion = moment(new Date(precio_anio[count].fechaModificacion)).format('LL');
            };
            response.status(200).json({
                success: true,
                precio_anio: precio_anio
            });
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({
                success: false,
                error: 'Error cargando precioCredito'
            });
        });
};

exports.get_registrar_precio_credito = (request, response, next) => {
    PrecioCredito.fetchPrecioActual()
        .then((precio_actual) => {
            response.render('configuracion/registrar_precio_credito', {
                precio_actual: precio_actual[0],
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                csrfToken: request.csrfToken()
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.post_registrar_precio_credito = (request, response, next) => {
    PrecioCredito.update(request.body.monto)
        .then(([precio_credito, fieldData]) => {
            response.redirect('/configuracion/precio_credito');
        })
        .catch((error) => {
            console.log(error);
        });
};