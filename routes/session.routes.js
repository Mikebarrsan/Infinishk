const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const sessionController = require('../controllers/session.controller');

router.get('/login', sessionController.get_login);
router.post('/login', sessionController.post_login);
router.get('/logout', sessionController.get_logout);
router.get('/signup', sessionController.get_signup);
router.post('/signup', sessionController.post_signup);

module.exports = router;