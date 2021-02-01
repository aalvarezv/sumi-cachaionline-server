const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { param, check } = require('express-validator');

const { crearInstitucion, listarInstituciones, actualizarInstitucion, eliminarInstitucion, datosInstitucion, busquedaInstituciones } = require('../controllers/institucionController');

router.post('/crear', auth, [ 
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria.'),
    check('direccion').not().isEmpty().withMessage('La dirección es obligatoria.'),
    check('email', 'El email es obligatorio.').notEmpty().isEmail().withMessage('No es un email válido.'),
    check('telefono', 'El teléfono es obligatorio.').notEmpty().isNumeric().withMessage('El teléfono debe ser un número.')
], crearInstitucion);
router.get('/listar', auth, listarInstituciones);
router.put('/actualizar', auth, [
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria.'),
    check('direccion').not().isEmpty().withMessage('La dirección es obligatoria.'),
    check('email', 'El email es obligatorio.').notEmpty().isEmail().withMessage('No es un email válido.'),
    check('telefono', 'El teléfono es obligatorio.').notEmpty().isNumeric().withMessage('El teléfono debe ser un número.')  
],actualizarInstitucion);
router.delete('/eliminar/:codigo', auth, eliminarInstitucion);
router.get('/datos/:codigo', auth, datosInstitucion);
router.get('/busqueda', auth, busquedaInstituciones);

module.exports = router;