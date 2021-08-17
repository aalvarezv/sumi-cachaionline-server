const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const auth = require('../middleware/auth');

const { enviarRespuestas } = require('../controllers/cuestionarioRespuestaController');

router.post('/enviar', auth, [
    check('codigo_cuestionario').exists().withMessage('El código cuestionario es obligatorio').notEmpty().withMessage('El código cuestionario no puede ser vacío'),
    check('archivo_base64').exists().withMessage('El archivo en formato base64 es obligatorio').notEmpty().withMessage('El archivo en formato base64 no puede ser vacío'),
], enviarRespuestas)


module.exports = router