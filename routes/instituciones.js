const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { body, check } = require('express-validator');

const { crearInstitucion, listarInstituciones, actualizarInstitucion, eliminarInstitucion, datosInstitucion, busquedaInstituciones } = require('../controllers/institucionController');

router.post('/crear', auth, [
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio.'),
    check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria.'),
    check('rut_usuario_rector').not().isEmpty().withMessage('El rut del rector es obligatorio.'),
    body('rut_usuario_rector').if(body('rut_usuario_rector').exists()).isLength({ min: 8, max: 9 }).withMessage('El rut del rector no es válido.'),
    check('rut_usuario_administrador').not().isEmpty().withMessage('El rut del administrador es obligatorio.'),
    body('rut_usuario_administrador').if(body('rut_usuario_administrador').exists()).isLength({ min: 8, max: 9 }).withMessage('El rut del administrador no es válido.'),
    check('direccion').not().isEmpty().withMessage('La direccion es obligatoria.'),
    check('email').not().isEmpty().withMessage('El email es obligatorio.'),
    body('email').if(body('email').exists()).isEmail().withMessage('No es un email válido.'),
    check('telefono').not().isEmpty().withMessage('El telefono es obligatorio.'),
    body('telefono').if(body('telefono').exists()).isNumeric().withMessage('No es un telefono válido.')
], crearInstitucion);
router.get('/listar', auth, listarInstituciones);
router.put('/actualizar', auth, [
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio.'),
    check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria.'),
    check('rut_usuario_rector').not().isEmpty().withMessage('El rut del rector es obligatorio.'),
    body('rut_usuario_rector').if(body('rut_usuario_rector').exists()).isLength({ min: 8, max: 9 }).withMessage('El rut del rector no es válido.'),
    check('rut_usuario_administrador').not().isEmpty().withMessage('El rut del administrador es obligatorio.'),
    body('rut_usuario_administrador').if(body('rut_usuario_administrador').exists()).isLength({ min: 8, max: 9 }).withMessage('El rut del administrador no es válido.'),
    check('direccion').not().isEmpty().withMessage('La direccion es obligatoria.'),
    check('email').not().isEmpty().withMessage('El email es obligatorio.'),
    body('email').if(body('email').exists()).isEmail().withMessage('No es un email válido.'),
    check('telefono').not().isEmpty().withMessage('El telefono es obligatorio.'),
    body('telefono').if(body('telefono').exists()).isNumeric().withMessage('No es un telefono válido.')  
],actualizarInstitucion);
router.delete('/eliminar/:codigo', auth, eliminarInstitucion);
router.get('/datos/:codigo', auth, datosInstitucion);
router.get('/busqueda/:filtro', auth, busquedaInstituciones);

module.exports = router;