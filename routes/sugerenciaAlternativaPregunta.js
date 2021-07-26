const express = require('express');
const router = express.Router();
const { check, query } = require('express-validator')
const auth = require('../middleware/auth');

const { cargarPreguntas, enviarSugerencias, getFormularios } = require('../controllers/sugerenciaAlternativaPreguntaController');


router.post('/cargar-preguntas', auth, [
    check('rut_usuario').exists().withMessage('El rut usuario es obligatorio').notEmpty().withMessage('El rut usuario no puede ser vacío'),
    check('nombre_formulario').exists().withMessage('El nombre formulario es obligatorio').notEmpty().withMessage('El nombre formulario no puede ser vacío'),
    check('codigo_materia').exists().withMessage('El código materia es obligatorio').notEmpty().withMessage('El código materia no puede ser vacío'),
    check('fecha_formulario').exists().withMessage('La fecha formulario es obligatorio').notEmpty().withMessage('La fecha formulario no puede ser vacío'),
    check('archivo_base64').exists().withMessage('El archivo base64 es obligatorio').notEmpty().withMessage('El archivo base64 no puede ser vacío'),
],  cargarPreguntas);
router.post('/enviar-sugerencias', auth, [
    check('rut_usuario').exists().withMessage('El rut usuario es obligatorio').notEmpty().withMessage('El rut usuario no puede ser vacío'),
    check('nombre_formulario').exists().withMessage('El nombre formulario es obligatorio').notEmpty().withMessage('El nombre formulario no puede ser vacío'),
    check('codigo_materia').exists().withMessage('El código materia es obligatorio').notEmpty().withMessage('El código materia no puede ser vacío'),
    check('archivo_base64').exists().withMessage('El archivo base64 es obligatorio').notEmpty().withMessage('El archivo base64 no puede ser vacío'),
], enviarSugerencias)

router.get('/formularios', auth, [
    query('rut_usuario').exists().withMessage('El rut usuario es obligatorio').notEmpty().withMessage('El rut usuario no puede ser vacío'),
    query('codigo_materia').exists().withMessage('El código materia es obligatorio').notEmpty().withMessage('El código materia no puede ser vacío'),
    query('fecha_formulario_desde').exists().withMessage('La fecha formulario desde es obligatoria').notEmpty().withMessage('La fecha formulario desde no puede ser vacía'),
    query('fecha_formulario_hasta').exists().withMessage('La fecha formulario hasta es obligatoria').notEmpty().withMessage('La fecha formulario hasta no puede ser vacía'),
], getFormularios)


module.exports = router