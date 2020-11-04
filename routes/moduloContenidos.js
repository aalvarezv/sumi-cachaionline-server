const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');
const { crearContenidoModulo, listarContenidosModulo, eliminarContenidoModulo }
       = require('../controllers/moduloContenidoController');

router.post('/crear', auth, 
[
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('codigo_modulo').not().isEmpty().withMessage('El código módulo es obligatorio.')
], crearContenidoModulo, listarContenidosModulo);

router.get('/listar/:codigo_modulo', auth, listarContenidosModulo);


router.delete('/eliminar/:codigo', auth, 
[
    query('codigo_modulo').not().isEmpty().withMessage('El código módulo es obligatorio.')
], eliminarContenidoModulo, listarContenidosModulo);


module.exports = router;