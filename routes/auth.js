const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const {autenticarUsuario, datosUsuarioAutenticado} = require('../controllers/authController');

//ruta para autenticar el usuario
router.post('/', autenticarUsuario);
router.get('/datos', auth, datosUsuarioAutenticado);

module.exports = router;

