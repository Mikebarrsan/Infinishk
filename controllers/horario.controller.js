const Grupo = require('../models/grupo.model');
const Alumno = require('../models/alumno.model');
const PlanPago = require('../models/planpago.model');
const Colegiatura = require('../models/colegiatura.model');
const Usuario = require('../models/usuario.model');
const Periodo = require('../models/periodo.model');
const PrecioCredito = require('../models/precio_credito.model');
const { getAllUsers, getAllCourses, getAllPeriods, getUserGroups } = require('../util/adminApiClient');
const { request } = require('express');

exports.get_propuesta_horario = async (request, response, next) => {
    const conf = await Alumno.fetchHorarioConfirmado(request.session.username)
    const planes = await PlanPago.fetchAllActivePlans()
    const confirmacion = conf[0][0].horarioConfirmado
    const planesPago = planes[0]

    if (confirmacion === 0) {
        const matricula = request.session.username;
        const periodo = await Periodo.fetchActivo();
        const periodoActivo = periodo[0][0].IDPeriodo;
        const precioCredito = await PrecioCredito.fetchPrecioActual();
        const precioActual = precioCredito[0][0].precioPesos;

        try {
            const schedule = await getUserGroups(periodoActivo, matricula);

            if (!schedule || !schedule.data) {
                throw new Error('No existen user groups para ese usuario');
            }

            const cursos = schedule.data.map(schedule => {
                const {
                    room = '',
                    name: nameSalon = '',
                    schedules = [],
                    course = {},
                    professor = {},
                    school_cycle = {}
                } = schedule;

                const {
                    id = periodoActivo,
                    name = '',
                    credits = ''
                } = course;

                const {
                    name: nombreProfesor = '',
                    first_surname = '',
                    second_surname = ''
                } = professor;

                const {
                    start_date = '',
                    end_date = '',
                } = school_cycle;

                const startDate = new Date(start_date);
                const endDate = new Date(end_date);

                const startDateFormat = `${startDate.getFullYear()}-${startDate.getMonth() + 1 < 10 ? '0' : ''}${startDate.getMonth() + 1}-${startDate.getDate() < 10 ? '0' : ''}${startDate.getDate()}`;
                const endDateFormat = `${endDate.getFullYear()}-${endDate.getMonth() + 1 < 10 ? '0' : ''}${endDate.getMonth() + 1}-${endDate.getDate() < 10 ? '0' : ''}${endDate.getDate()}`;

                const nombreSalon = `${room} ${nameSalon}`;
                const nombreProfesorCompleto = `${nombreProfesor} ${first_surname} ${second_surname}`;

                const semestre = course.plans_courses?.[0]?.semester || "Desconocido";

                const precioMateria = credits * precioActual;

                const horarios = schedules.map(schedule => {
                    const {
                        weekday = '',
                        start_hour = '',
                        end_hour = '',
                    } = schedule;

                    // Crear objetos Date a partir de las horas de inicio y final
                    const startDate = new Date(start_hour);
                    const endDate = new Date(end_hour);

                    const fechaInicio = `${startDate.getHours()}:${startDate.getMinutes() < 10 ? '0' : ''}${startDate.getMinutes()}`;
                    const fechaTermino = `${endDate.getHours()}:${endDate.getMinutes() < 10 ? '0' : ''}${endDate.getMinutes()}`;

                    return {
                        diaSemana: weekday,
                        fechaInicio,
                        fechaTermino
                    };
                });

                return {
                    idMateria: id,
                    nombreMat: name,
                    creditos: credits,
                    nombreProfesorCompleto,
                    nombreSalon,
                    semestre,
                    precioMateria,
                    horarios,
                    startDateFormat,
                    endDateFormat,
                }
            });

            const precioTotal = cursos.reduce((total, curso) => total + curso.precioMateria, 0);

            response.render('alumnos/consultarHorario', {
                schedule: cursos,
                confirmacion: confirmacion,
                planesPago: planesPago,
                precioTotal: precioTotal,
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                csrfToken: request.csrfToken()
            })
        }

        catch (error) {
            console.error('Error realizando operaciones:', error);
        }
    }

    else if (confirmacion === 1) {
        const schedule = await Grupo.fetchSchedule(request.session.username)
        const precio = await Grupo.fetchPrecioTotal(request.session.username)
        const precioTotal = precio[0][0].Preciototal
        response.render('alumnos/consultarHorario', {
            schedule: schedule,
            precioTotal: precioTotal,
            confirmacion: confirmacion,
            planesPago: planesPago,
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            csrfToken: request.csrfToken()
        })
    }
};

exports.post_confirmar_horario = async (request, response, next) => {
    await Alumno.updateHorarioAccepted(request.session.username)
    await Colegiatura.createColegiaturasFichas(request.body.IDPlanPago, request.session.username)
    await Usuario.fetchCorreo(request.session.username)
    response.redirect('/horario/consultaHorario');
}