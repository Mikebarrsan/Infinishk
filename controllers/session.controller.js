const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


exports.get_login = (request, response, next) => {
    const error = request.session.error || '';
    request.session.error = '';
    response.render('login', {
        username: request.session.username || '',
        registrar: false,
        error: error,
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    });
};

exports.post_login = (request, response, next) => {
    Usuario.fetchOne(request.body.IDUsuario)
        .then(([users, fieldData]) => {
            if (users.length == 1) {
                // users[0] contiene el objeto de la respuesta de la consulta
                const user = users[0];
                // Ya que verificamos que el usuario existe en la base de datos
                bcrypt.compare(request.body.password, user.Contraseña)
                    .then(doMatch => {
                        // Si la promesa es verdadero, entonces inicias sesion en la pagina
                        if (doMatch) {
                            // Si el usuario aun esta activo en el sistema
                            if (users[0].usuarioActivo == 1) {
                                Usuario.getPermisos(user.IDUsuario)
                                    .then(([permisos, fieldData]) => {
                                        Usuario.getRol(user.IDUsuario)
                                            .then(([rol, fieldData]) => {
                                                request.session.isLoggedIn = true;
                                                request.session.permisos = permisos;
                                                request.session.rol = rol[0].IDRol;
                                                request.session.username = user.IDUsuario;
                                                return request.session.save(err => {
                                                    response.redirect('/pagos');
                                                })
                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            })
                                    })
                                    .catch((error) => {
                                        console.log(error)
                                    });
                            } else {
                                request.session.error = 'El usuario insertado ya no está activo en el sistema. Por favor busca ayuda si requieres iniciar sesión.';
                                response.redirect('/auth/login')
                            }
                            // Por si los passwords no hacen match
                        } else {
                            request.session.error = 'El usuario y/o contraseña son incorrectos.';
                            return response.redirect('/auth/login');
                        }
                        // Por si hay un error en la libreria o algo
                    }).catch(err => {
                        response.redirect('/auth/login');
                    });

                // Por si el usuario no existe en la base de datos
            } else {
                request.session.error = 'El usuario y/o contraseña con incorrectos.';
                response.redirect('/auth/login');
            }
        })
        .catch((error) => {
            console.log(error)
        })

};

exports.get_logout = (request, response, next) => {
    request.session.destroy(() => {
        response.redirect('/auth/login'); //Este código se ejecuta cuando la sesión se elimina.
    });
};

exports.get_signup = (request, response, next) => {
    const error = request.session.error || '';
    request.session.error = '';
    response.render('login', {
        username: request.session.username || '',
        registrar: true,
        error: error,
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    });
};

exports.post_signup = (request, response, next) => {
    const new_user = new Usuario(request.body.IDUsuario, request.body.password);
    new_user.updateContra()
        .then(([rows, fieldData]) => {
            response.redirect('/auth/login');
        })
        .catch((error) => {
            request.session.error = 'Nombre de usuario invalido.';
            console.log(error)
            response.redirect('/auth/signup');
        })
}

exports.get_set_password = (request,response,next) =>{
    const matricula = request.query.matricula; // Obtiene la matrícula de la URL
    response.render('set_password', { 
        matricula,
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    }); // Renderiza la página para establecer la contraseña con la matrícula
}

exports.post_set_password = async (request,response,next) => {
    const new_user = new Usuario(request.body.matricula, request.body.newPassword);
    // Verifica la matrícula y actualiza la contraseña del usuario en la base de datos
    new_user.updateContra()
        .then(([rows, fieldData]) => {
            response.redirect('/auth/login');
        })
        .catch((error) => {
            request.session.error = 'Nombre de usuario invalido.';
            console.log(error)
            response.redirect('/auth/set_password');
        })
}

exports.get_reset_password = (request,response,next) => {
    response.render('reset_password', { 
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    });
}

exports.post_reset_password = async (request,response,next) => {
    const correo = request.body.correo;

    const matricula = await Usuario.fetchUser(correo); 

    const user = matricula[0][0].IDUsuario;

    console.log(user);

    const setPasswordLink = `http://localhost:4000/auth/set_password?matricula=${user}`;

    const msg = {
        to: correo,
        from: {
            name: 'VIA PAGO',
            email: '27miguelb11@gmail.com',
        },
        subject: 'Reestabecer contraseña de VIA Pago',
        html: `<p>Hola,</p><p>Haz clic en el siguiente enlace para reestablecer tu contraseña: <a href="${setPasswordLink}">Reestablecer Contraseña</a></p>`
    };

    try {
        await sgMail.send(msg);
        console.log('Correo electrónico enviado correctamente');
    } 
    catch (error) {
        console.error('Error al enviar el correo electrónico:', error.toString());
    }

    response.redirect('/auth/login');
}