const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');

const { 
    crearRingPregunta, 
    eliminarRingPregunta, 
    crearRingPreguntaMasivo, 
    eliminarRingPreguntaMasivo,
    listarRingPreguntas, 
    listarPreguntasInscritasRing,
    countPreguntasRing,
    getPuntajesPreguntaRing,
    updatePuntajesPreguntaRing,
} = require('../controllers/ringPreguntaController');

router.post('/crear', auth, [
    check('codigo_ring').not().isEmpty().withMessage('El codigo del ring es obligatorio.'),
    check('codigo_pregunta').not().isEmpty().withMessage('El código de la pregunta es obligatorio.'),
], crearRingPregunta);

router.post('/crear/masivo', auth,[
    check('ring_preguntas_add').not().isEmpty().withMessage('Es requerido un arreglo con al menos un objeto que contenga el código pregunta y código ring para agregar.')
], crearRingPreguntaMasivo);

router.get('/listar/preguntas', auth, [
    query('codigo_ring').exists().withMessage('El código de ring es requerido')
], listarRingPreguntas);


router.get('/listar/preguntas/ring', auth, [
    query('codigo_ring').exists().withMessage('El código de ring es requerido')
], listarPreguntasInscritasRing);

router.delete('/eliminar/:codigo_ring/:codigo_pregunta', auth, eliminarRingPregunta);

router.delete('/eliminar/masivo',[
    query('ring_preguntas_del').exists().withMessage('Es requerido un parametro tipo arreglo con al menos un objeto que contenga el código pregunta y código ring para eliminar.'),
], auth, eliminarRingPreguntaMasivo);

router.get('/count/preguntas', auth, [
    query('codigo_ring').exists().withMessage('El código de ring es requerido')
], countPreguntasRing)


router.get('/puntajes-pregunta', auth, [
    query('codigo_ring').exists().withMessage('El codigo ring es obligatorio.').notEmpty().withMessage('El codigo ring no puede ser vacío'),
    query('codigo_pregunta').exists().withMessage('El codigo pregunta es obligatorio.').notEmpty().withMessage('El código pregunta no puede ser vacío'),   
], getPuntajesPreguntaRing)

router.put('/puntajes-pregunta', auth, [
    check('codigo_ring').exists().withMessage('El codigo ring es obligatorio.').notEmpty().withMessage('El codigo ring no puede ser vacío'),
    check('codigo_pregunta').exists().withMessage('El codigo pregunta es obligatorio.').notEmpty().withMessage('El código pregunta no puede ser vacío'),  
    check('puntos_respuesta_correcta').exists().withMessage('Puntos respuesta correcta es obligatorio.').notEmpty().withMessage('Puntos respuesta correcta no puede ser vacío'), 
    check('puntos_respuesta_incorrecta').exists().withMessage('Puntos respuesta incorrecta es obligatorio.').notEmpty().withMessage('Puntos respuesta incorrecta no puede ser vacío'), 
    check('puntos_respuesta_omitida').exists().withMessage('Puntos respuesta omitida es obligatorio.').notEmpty().withMessage('Puntos respuesta omitida no puede ser vacío'),
    check('puntos_respuesta_timeout').exists().withMessage('Puntos respuesta timeout es obligatorio.').notEmpty().withMessage('Puntos respuesta timeout no puede ser vacío'),
], updatePuntajesPreguntaRing)


module.exports = router;