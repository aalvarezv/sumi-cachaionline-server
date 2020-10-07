const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, check, query } = require('express-validator');

const { crearRing, listarRings, actualizarRing, eliminarRing, datosRing, busquedaRings } = require('../controllers/ringController');

router.post('/crear', auth, [
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio.'),
    check('nombre').not().isEmpty().withMessage('El nombre es obligatorio.'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria.'),
    check('fecha_hora_inicio').not().isEmpty().withMessage('La fecha y hora de inicio son obligatorias.'),
    body('fecha_hora_inicio').if(body('fecha_hora_inicio').exists()).isDate().withMessage('No es una fecha y/o hora de inicio válida.'),
    check('fecha_hora_fin').not().isEmpty().withMessage('La fecha y hora de termino son obligatorias.'),
    body('fecha_hora_fin').if(body('fecha_hora_fin').exists()).isDate().withMessage('No es una fecha y/o hora de termino válida.'),
    check('rut_usuario_creador').not().isEmpty().withMessage('El rut del creador es obligatorio.'),
    body('rut_usuario_creador').if(body('rut_usuario_creador').exists()).isLength({ min: 8, max: 9 }).withMessage('El rut del creador no es válido.')
], crearRing);

router.get('/listar', auth, listarRings);

router.put('/actualizar', auth, [
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio.'),
    check('nombre').not().isEmpty().withMessage('El nombre es obligatorio.'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria.'),
    check('fecha_hora_inicio').not().isEmpty().withMessage('La fecha y hora de inicio son obligatorias.'),
    body('fecha_hora_inicio').if(body('fecha_hora_inicio').exists()).isDate().withMessage('No es una fecha y/o hora de inicio válida.'),
    check('fecha_hora_fin').not().isEmpty().withMessage('La fecha y hora de termino son obligatorias.'),
    body('fecha_hora_fin').if(body('fecha_hora_fin').exists()).isDate().withMessage('No es una fecha y/o hora de termino válida.'),
    check('rut_usuario_creador').not().isEmpty().withMessage('El rut del creador es obligatorio.'),
    body('rut_usuario_creador').if(body('rut_usuario_creador').exists()).isLength({ min: 8, max: 9 }).withMessage('El rut del creador no es válido.')
], actualizarRing);

router.delete('/eliminar/:codigo', auth, eliminarRing);
router.get('/datos/:codigo', auth, datosRing);
router.get('/busqueda/:filtro', auth, busquedaRings);

module.exports = router;