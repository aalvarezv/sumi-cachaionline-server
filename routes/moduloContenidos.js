const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');
const { crearModuloContenido, listarModuloContenidos, actualizarModuloContenido, eliminarModuloContenido, contenidoModulo}
       = require('../controllers/moduloContenidoController');

router.post('/crear', auth, 
[
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('codigo_modulo').not().isEmpty().withMessage('El código módulo es obligatorio.')
], crearModuloContenido, listarModuloContenidos);

router.get('/listar/:codigo_modulo', auth, listarModuloContenidos);

router.put('/actualizar', auth, 
[
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
    check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria, verifique'),
    check('codigo_modulo').not().isEmpty().withMessage('El codigo modulo es obligatorio, verifique'),
]
,actualizarModuloContenido);

router.delete('/eliminar/:codigo', auth, eliminarModuloContenido, listarModuloContenidos);

router.get('/modulo/:codigo_modulo/:codigo_unidad/:codigo_materia', contenidoModulo);

module.exports = router;