const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const configuracionController = require('../controllers/configuracion.controller');

// Incluyes el archivo para verificar si esta autenticado y los permisos
const isAuth = require('../util/is-Auth');
const can_ConsultarCostoCredito = require('../util/privileges/can_consultar_precioCredito');
const can_ConsultarPlanPago = require('../util/privileges/can_consultar_planPago');
const can_RegistrarCostoCredito = require('../util/privileges/admin/registros/can_registrar_PrecioCredito');
const can_RegistrarPlanPago = require('../util/privileges/admin/registros/can_registrar_PlanPago');
const can_ModificarPlanPago = require('../util/privileges/admin/otros/can_modificar_PlanPago');
const can_RegistrarRol = require('../util/privileges/admin/registros/can_registrar_Rol');
const can_ConsultarUsuario = require('../util/privileges/admin/consultas/can_consultar_Usuario');
const can_RegistrarUsuario = require('../util/privileges/admin/registros/can_registrar_usuario');

router.get('/administrar_planpago',configuracionController.get_administrar_planpago);
router.get('/',isAuth,can_ConsultarPlanPago,configuracionController.get_configuracion);

module.exports = router;