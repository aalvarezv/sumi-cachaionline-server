const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const { guardarRespuesta } = require('../controllers/respuestaController');

router.post('/guardar', auth, [
    check('rut_usuario').not().isEmpty().withMessage('El rut usuario es obligatorio.'),
    check('codigo_pregunta').not().isEmpty().withMessage('El código pregunta es obligatorio.'),
    check('codigo_alternativa').not().isEmpty().withMessage('El código alternativa es obligatorio.'),
    check('tiempo').not().isEmpty().withMessage('El tiempo es obligatorio.').isInt({ min:1 }).withMessage('El tiempo debe ser mayor a cero.'),
    check('correcta').not().isEmpty().withMessage('Si la respuesta es correcta es obligatorio.'),
    check('omitida').not().isEmpty().withMessage('Si la respuesta fue omitida es obligatorio.'),
    check('vio_pista').not().isEmpty().withMessage('Si vió pista es obligatorio.'),
    check('vio_solucion').not().isEmpty().withMessage('Si vió solucion es obligatorio.'),
], guardarRespuesta);


module.exports = router