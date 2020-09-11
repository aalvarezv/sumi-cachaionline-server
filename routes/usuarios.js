const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paginateResults = require('../middleware/paginateResults');
const { body, check } = require('express-validator');

const {crearUsuario, listarUsuarios, actualizarUsuario, 
       eliminarUsuario, datosUsuario, busquedaUsuarios} = require('../controllers/usuarioController');

router.post('/crear', 
[
    check('rut').not().isEmpty().withMessage('El rut es obligatorio.'),
    body('rut').if(body('rut').exists()).isLength({ min: 8, max: 9 }).withMessage('El rut no es válido.'),
    check('clave').not().isEmpty().withMessage('La clave es obligatoria.'),
    check('email').not().isEmpty().withMessage('El email es obligatorio.'),
    body('email').if(body('email').exists()).isEmail().withMessage('No es un email válido.'),
    check('nombre').not().isEmpty().withMessage('El nombre es obligatorio.'),
    check('codigo_rol').not().isEmpty().withMessage('El código de rol es obligatorio.')
], crearUsuario);

router.get('/listar', auth, listarUsuarios, paginateResults);
router.put('/actualizar', auth, 
[
    check('rut').not().isEmpty().withMessage('El rut es obligatorio.'),
    body('rut').if(body('rut').exists()).isLength({ min: 8, max: 9 }).withMessage('El rut no es válido.'),
    check('clave').not().isEmpty().withMessage('La clave es obligatoria.'),
    check('email').not().isEmpty().withMessage('El email es obligatorio.'),
    body('email').if(body('email').exists()).isEmail().withMessage('No es un email válido.'),
    check('nombre').not().isEmpty().withMessage('El nombre es obligatorio.'),
    check('codigo_rol').not().isEmpty().withMessage('El código de rol es obligatorio.')
],
actualizarUsuario);
router.delete('/eliminar/:rut', auth, eliminarUsuario);
router.get('/datos/:rut', auth, datosUsuario);
router.get('/busqueda/:filtro', auth, busquedaUsuarios);

module.exports = router;