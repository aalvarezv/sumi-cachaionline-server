const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');

const { crearRingPregunta, eliminarRingPregunta, 
        crearRingPreguntaMasivo, eliminarRingPreguntaMasivo,
        listarRingPreguntas } = require('../controllers/ringPreguntaController');

router.post('/crear', auth, [
    check('codigo_ring').not().isEmpty().withMessage('El codigo del ring es obligatorio.'),
    check('codigo_pregunta').not().isEmpty().withMessage('El código de la pregunta es obligatorio.'),
], crearRingPregunta);
router.post('/crear/masivo', auth,[
    check('ring_preguntas_add').not().isEmpty().withMessage('Es requerido un arreglo con al menos un objeto que contenga el código pregunta y código ring para agregar.')
], crearRingPreguntaMasivo);

router.get('/listar/ring-preguntas/:codigo_ring', auth, listarRingPreguntas);

router.delete('/eliminar/:codigo_ring/:codigo_pregunta', auth, eliminarRingPregunta);

router.delete('/eliminar/masivo',[
    query('ring_preguntas_del').exists().withMessage('Es requerido un parametro tipo arreglo con al menos un objeto que contenga el código pregunta y código ring para eliminar.'),
], auth, eliminarRingPreguntaMasivo);

module.exports = router;