const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, check, query } = require('express-validator');

const { crearRingUsuario, eliminarRingUsuario } = require('../controllers/ringUsuarioController');

router.post('/crear', auth, [
    check('codigo_ring').not().isEmpty().withMessage('El codigo del ring es obligatorio.'),
    check('rut_usuario').not().isEmpty().withMessage('El rut del usuario es obligatorio.'),
], crearRingUsuario);

router.delete('/eliminar/:codigo_ring', auth, [
    query('rut_usuario').not().isEmpty().withMessage('El rut del usuario es obligatorio.'),
    query('codigo_ring').not().isEmpty().withMessage('El código del ring es obligatorio.')
], eliminarRingUsuario);


module.exports = router;