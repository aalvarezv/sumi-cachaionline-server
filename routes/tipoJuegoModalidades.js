const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const { crearTipoJuegoModalidad, listarTipoJuegoModalidad, } = require('../controllers/TipoJuegoModalidadController');

router.post('/crear', auth, [
    check('codigo_tipo_juego').not().isEmpty().withMessage('El codigo del ring es obligatorio.'),
    check('codigo_modalidad').not().isEmpty().withMessage('El rut del usuario es obligatorio.'),
], crearTipoJuegoModalidad);

router.get('/listar/tipo-juego-modalidad/:codigo_tipo_juego', auth, listarTipoJuegoModalidad);


module.exports = router;