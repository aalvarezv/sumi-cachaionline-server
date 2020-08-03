const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { body, check } = require('express-validator');

const {crearUsuario, listarUsuarios, actualizarUsuario, eliminarUsuario, datosUsuario} = require('../controllers/usuarioController');

router.post('/crear', [
    check('rut').not().isEmpty().withMessage('El rut es obligatorio, verifique'),
    body('rut').if(body('rut').exists()).isLength({ min: 8, max: 9 }).withMessage('El rut no es válido, verifique'),
    check('clave').not().isEmpty().withMessage('La clave es obligatoria, verifique'),
    check('email').not().isEmpty().withMessage('El email es obligatorio, verifique'),
    body('email').if(body('email').exists()).isEmail().withMessage('No es un email válido, verifique'),
    check('nombre').not().isEmpty().withMessage('El nombre es obligatorio, verifique'),
    check('telefono').not().isEmpty().withMessage('El teléfono es obligatorio, verifique'),
    body('telefono').if(body('telefono').exists()).isMobilePhone().withMessage('No es un número de teléfono válido'),
    check('codigo_rol').not().isEmpty().withMessage('El código de rol es obligatorio')
], crearUsuario);
router.get('/listar', auth, listarUsuarios);
router.put('/actualizar', auth, actualizarUsuario);
router.delete('/eliminar/:rut', auth, eliminarUsuario);
router.get('/datos/:rut', auth, datosUsuario);

module.exports = router;