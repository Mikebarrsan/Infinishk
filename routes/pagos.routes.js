const express = require('express');
const multer = require('multer');
// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

//fileStorage: Es nuestra constante de configuración para manejar el almacenamiento
const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        //'uploads': Es el directorio del servidor donde se subirán los archivos 
        callback(null, 'uploads');
    },
    filename: (request, file, callback) => {
        //aquí configuramos el nombre que queremos que tenga el archivo en el servidor, 
        //para que no haya problema si se suben 2 archivos con el mismo nombre concatenamos el timestamp
        callback(null,Number(new Date()).toString() + file.originalname);
    },
});

router.use(multer({ storage: fileStorage }).single('archivo')); 

const pagosController = require('../controllers/pagos.controller');

// Incluyes el archivo para verificar si esta autenticado y los permisos
const isAuth = require('../util/is-Auth');
const can_AdministrarSolicitud = require('../util/privileges/can_administrar_Solicitud');
const can_RegistrarSolicitud = require('../util/privileges/can_registrar_Solicitud');
const can_ConsultarEstadoCuenta = require('../util/privileges/can_consultar_EstadoCuenta');
const can_RegistrarPagoManual = require('../util/privileges/admin/registros/can_registrar_PagoManual');
const can_RegistrarPagoTransferencia = require('../util/privileges/admin/registros/can_registrar_ArchivoTransferencia');
const can_ReportesIngresos = require('../util/privileges/admin/consultas/can_ReporteIngresos');
const can_ReportesMetodoPago = require('../util/privileges/admin/consultas/can_ReporteMetodoPago');
const can_RegistrarPagoExtra = require('../util/privileges/admin/registros/can_registrar_PagoExtra');
const can_AdministrarPagoExtra = require('../util/privileges/admin/otros/can_administrar_PagoExtra');

// Pagos Extra
router.get('/registrar_pago_extra', isAuth, can_RegistrarPagoExtra, pagosController.get_registrar_pago_extra);
router.post('/registrar_pago_extra', isAuth, can_RegistrarPagoExtra, pagosController.post_registrar_pago_extra);
router.get('/pagos_extra', isAuth, can_AdministrarPagoExtra, pagosController.get_pago_extra);
router.post('/pagos_extra/modify', isAuth, can_AdministrarPagoExtra, pagosController.post_pago_extra_modify);
router.post('/pagos_extra/modify_status', can_AdministrarPagoExtra, isAuth, pagosController.post_modify_status);
router.post('/pagos_extra/delete', isAuth, can_AdministrarPagoExtra, pagosController.post_pago_extra_delete);

// Solicitudes
router.get('/solicitudes', isAuth, can_AdministrarSolicitud, pagosController.get_solicitudes);
router.post('/solicitudes/modify', isAuth, can_AdministrarSolicitud, pagosController.post_solicitudes_modify);
router.post('/solicitudes/delete', isAuth, can_AdministrarSolicitud, pagosController.post_solicitudes_delete);
router.get('/fetch_alumno/autocomplete/:valor_busqueda', isAuth, pagosController.get_autocomplete);
router.get('/fetch_alumno/autocomplete/', isAuth, pagosController.get_autocomplete);
router.get('/registrar_solicitud', isAuth, can_RegistrarSolicitud, pagosController.get_registrar_solicitud);
router.post('/fetch_registrar_solicitud', isAuth, can_RegistrarSolicitud, pagosController.post_fetch_registrar_solicitud);
router.post('/registrar_solicitud', isAuth, can_RegistrarSolicitud, pagosController.post_registrar_solicitud);

router.get('/', isAuth, pagosController.get_pago);

module.exports = router;