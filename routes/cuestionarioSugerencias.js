const express = require('express');
const router = express.Router();
const { check, query } = require('express-validator')
const auth = require('../middleware/auth');

const { cargarPreguntas, getCuestionarios } = require('../controllers/cuestionarioSugerenciaController');


router.post('/cargar-preguntas', auth, [
    check('rut_usuario').exists().withMessage('El rut usuario es obligatorio').notEmpty().withMessage('El rut usuario no puede ser vacío'),
    check('nombre_cuestionario').exists().withMessage('El nombre cuestionario es obligatorio').notEmpty().withMessage('El nombre cuestionario no puede ser vacío'),
    check('codigo_materia').exists().withMessage('El código materia es obligatorio').notEmpty().withMessage('El código materia no puede ser vacío'),
    check('fecha_cuestionario').exists().withMessage('La fecha cuestionario es obligatorio').notEmpty().withMessage('La fecha cuestionario no puede ser vacío'),
    check('archivo_base64').exists().withMessage('El archivo en formato base64 es obligatorio').notEmpty().withMessage('El archivo en formato base64 no puede ser vacío'),
],  cargarPreguntas);

router.get('/cuestionarios', auth, [
    query('rut_usuario').exists().withMessage('El rut usuario es obligatorio').notEmpty().withMessage('El rut usuario no puede ser vacío'),
    query('codigo_materia').exists().withMessage('El código materia es obligatorio').notEmpty().withMessage('El código materia no puede ser vacío'),
    query('fecha_cuestionario_desde').exists().withMessage('La fecha cuestionario desde es obligatoria').notEmpty().withMessage('La fecha cuestionario desde no puede ser vacía'),
    query('fecha_cuestionario_hasta').exists().withMessage('La fecha cuestionario hasta es obligatoria').notEmpty().withMessage('La fecha cuestionario hasta no puede ser vacía'),
], getCuestionarios)


module.exports = router