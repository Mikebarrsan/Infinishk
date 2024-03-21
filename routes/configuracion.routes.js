const express = require('express');
const router = express.Router();

const configuracionController = require('../controllers/configuracion.controller');


router.get('/periodos', configuracionController.get_periodos);
router.get('/', configuracionController.get_configuracion);


module.exports = router;