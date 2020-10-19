const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, check, query } = require('express-validator');

const { crearRingPregunta, eliminarRingPregunta } = require('../controllers/ringPreguntaController');

router.post('/crear', auth, [
    check('codigo_ring').not().isEmpty().withMessage('El codigo del ring es obligatorio.'),
    check('codigo_pregunta').not().isEmpty().withMessage('El código de la pregunta es obligatorio.'),
], crearRingPregunta);

router.delete('/eliminar/:codigo_ring', auth, [
    query('codigo_ring').not().isEmpty().withMessage('El codigo del ring es obligatorio.'),
    query('codigo_pregunta').not().isEmpty().withMessage('El código de la pregunta es obligatorio.')
], eliminarRingPregunta);


module.exports = router;