const Alumno = require('../models/alumno.model');
const Fichas = require('../models/fichas_pago.model');

exports.post_fetch_fichas = (request, response, next) => {
    let matches = request.body.buscar.match(/(\d+)/);
    Alumno.fetchOne(matches[0])
        .then(([alumno, fieldData]) => {
            Fichas.fetch(matches[0])
                .then(([fichas, fieldData]) => {
                    response.render('alumnos/modificar_fichas', {
                        alumno: alumno,
                        fichas: fichas, 
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

exports.get_fichas = (request, response, next) => {
    response.render('fetch_alumno', {
        pago_manual: false,
        solicitud_pago: false, 
        fichas_pago: true,
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
};

exports.post_fichas_modify = async (request, response, next) => { 
    const id = request.body.id;
    const descuento = request.body.descuento;
    const fecha_lim = request.body.fecha_lim;
    const nota = request.body.nota;
    const modificador = request.session.username;

    console.log('Received data:', { descuento, fecha_lim, nota, modificador, id });

    try {
        const data = await Fichas.update(descuento, fecha_lim, nota, modificador, id);
        console.log('Update result: ', data);

        response.status(200).json({ success: true, data: data });
    } catch (error) {
        console.error('Error updating data:', error);
        response.status(500).json({ success: false, message: 'Error actualizando la ficha' });
    }
};