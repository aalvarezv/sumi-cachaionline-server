const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');
const { crearModuloContenido, listarModuloContenidos, eliminarModuloContenido }
       = require('../controllers/moduloContenidoController');

router.post('/crear', auth, 
[
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('codigo_modulo').not().isEmpty().withMessage('El código módulo es obligatorio.')
], crearModuloContenido, listarModuloContenidos);

router.get('/listar/:codigo_modulo', auth, listarModuloContenidos);


router.delete('/eliminar/:codigo', auth, 
[
    query('codigo_modulo').not().isEmpty().withMessage('El código módulo es obligatorio.')
], eliminarModuloContenido, listarModuloContenidos);


module.exports = router;