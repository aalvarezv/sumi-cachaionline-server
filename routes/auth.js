const express = require('express');
const router = express.Router();
const {autenticarUsuario} = require('../controllers/authController');

//ruta para autenticar el usuario
router.post('/', autenticarUsuario);

module.exports = router;

