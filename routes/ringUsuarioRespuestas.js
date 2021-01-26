const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, check, query } = require('express-validator');

const {crearRingUsuarioRespuesta, DesactivarRingUsuarioRespuesta} = require('../controllers/ringUsuarioRespuestaController');


router.post('/crear', auth, [
    check('codigo_ring').not().isEmpty().withMessage('El codigo del ring es obligatorio.'),
    check('rut_usuario').not().isEmpty().withMessage('El rut usuario es obligatorio.'),
    check('codigo_pregunta').not().isEmpty().withMessage('El codigo de la pregunta es obligatorio.'),
], crearRingUsuarioRespuesta);

module.exports = router;