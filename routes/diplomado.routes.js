const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const diplomadoController = require('../controllers/diplomado.controller');

// Incluyes el archivo para verificar si esta autenticado y los permisos
const isAuth = require('../util/is-Auth');
const can_ConsultarDiplomado = require(
    '../util/privileges/can_consultar_diplomado');
const can_RegistrarDiplomado = require(
    '../util/privileges/admin/registros/can_registrar_Diplomado');
const can_ModificarDiplomado = require(
    '../util/privileges/admin/otros/can_modificar_Diplomado');

router.get('/registrar_diplomado',
isAuth,can_RegistrarDiplomado,diplomadoController.get_registrar_diplomado);
router.post('/registrar_diplomado',
isAuth,can_RegistrarDiplomado,diplomadoController.post_registrar_diplomado);
router.get('/consultar_diplomado',
isAuth, can_ConsultarDiplomado,diplomadoController.get_consultar_diplomado);
router.get('/editar_diplomado',
isAuth,can_ModificarDiplomado,diplomadoController.get_modificar_diplomado);
router.get('/check_diplomado',
isAuth,can_ModificarDiplomado,diplomadoController.get_check_diplomado);
router.get('/autocomplete',
isAuth,can_ModificarDiplomado,diplomadoController.get_autocomplete);
router.post('/editar_diplomado',
isAuth,can_ModificarDiplomado,diplomadoController.post_fetch_diplomado);
router.post('/resultado_diplomado',
isAuth,can_ModificarDiplomado,diplomadoController.post_modificar_diplomado);
router.get('/', diplomadoController.get_diplomado);

module.exports = router;