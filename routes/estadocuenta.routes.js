const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const estadocuentaController = require('../controllers/estadocuenta.controller');

const isAuth = require('../util/is-Auth');
const can_ConsultarEstadoCuenta = require('../util/privileges/can_consultar_EstadoCuenta');
const can_RealizarPago = require('../util/privileges/alumno/can_realizar_pago');

router.get('/pagar', isAuth, can_RealizarPago, horarioController.get_pago_alumno);
router.post('/mandar_pago', isAuth, can_RealizarPago, horarioController.post_mandar_pago);

router.get('/recibir_pago', horarioController.get_recibir_pago);
router.post('/recibir_pago', horarioController.post_recibir_pago);

router.post('/respuesta_pago', horarioController.post_respuesta_pago);

// Estado cuenta
router.get('/estado_cuenta', isAuth, can_ConsultarEstadoCuenta, estadocuentaController.get_estado_cuenta);


module.exports = router;