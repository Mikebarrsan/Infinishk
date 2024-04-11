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

router.get('/registroTransferencia', pagosController.get_registro_transferencias);
router.post('/registroTransferencia', pagosController.post_subir_archivo);
router.post('/resultadoTransferencia', pagosController.post_registrar_transferencia);
router.get('/', isAuth, pagosController.get_pago);

module.exports = router;