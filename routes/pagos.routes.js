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

router.get('/registrar_pago_manual', isAuth, can_RegistrarPagoManual, pagosController.get_registrar_pago_manual);
router.get('/fetch_alumno/autocomplete/:valor_busqueda', isAuth, pagosController.get_autocomplete);
router.get('/fetch_alumno/autocomplete/', isAuth, pagosController.get_autocomplete);
router.post('/fetch_registrar_pago_manual', isAuth, can_RegistrarPagoManual, pagosController.post_fetch_registrar_pago_manual);
router.post('/registrar_pago_manual/pago_extra', isAuth, can_RegistrarPagoManual, pagosController.post_registrar_pago_manual_pago_extra);
router.post('/registrar_pago_manual/diplomado', isAuth, can_RegistrarPagoManual, pagosController.post_registrar_pago_manual_diplomado);
router.post('/registrar_pago_manual/colegiatura', isAuth, can_RegistrarPagoManual, pagosController.post_registrar_pago_manual_colegiatura);
router.get('/', isAuth, pagosController.get_pago);

module.exports = router;