const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const {autenticarUsuario, datosUsuarioAutenticado} = require('../controllers/authController');
const { check } = require('express-validator');

//ruta para autenticar el usuario
router.post('/', [
    check('rut').exists().withMessage('El rut es obligatorio').notEmpty().withMessage('El rut no debe ser vacío'),
    check('clave').exists().withMessage('La clave obligatoria').notEmpty().withMessage('La clave no debe ser vacía'),
], autenticarUsuario);
router.get('/datos', auth, datosUsuarioAutenticado);

module.exports = router;

