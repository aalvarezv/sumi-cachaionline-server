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
    check('fecha_hora_fin').not().isEmpty().withMessage('La fecha y hora de termino son obligatorias.'),
    check('rut_usuario_creador').not().isEmpty().withMessage('El rut del creador es obligatorio.'),
    check('codigo_tipo_juego').not().isEmpty().withMessage('El codigo del tipo de juego es obligatorio, verifique'),
    check('cantidad_usuarios').not().isEmpty().withMessage('La cantidad de usuarios es obligatoria.'),
], crearRing);

router.get('/listar', auth, listarRings);

router.put('/actualizar', auth, [
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio.'),
    check('nombre').not().isEmpty().withMessage('El nombre es obligatorio.'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria.'),
    check('fecha_hora_inicio').not().isEmpty().withMessage('La fecha y hora de inicio son obligatorias.'),
    check('fecha_hora_fin').not().isEmpty().withMessage('La fecha y hora de termino son obligatorias.'),
    check('rut_usuario_creador').not().isEmpty().withMessage('El rut del creador es obligatorio.'),
    check('codigo_tipo_juego').not().isEmpty().withMessage('El codigo del tipo de juego es obligatorio, verifique'),
    check('cantidad_usuarios').not().isEmpty().withMessage('La cantidad de usuarios es obligatoria.'),
], actualizarRing);

router.delete('/eliminar/:codigo', auth, eliminarRing);
router.get('/datos/:codigo', auth, datosRing);

module.exports = router;