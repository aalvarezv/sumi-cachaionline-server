const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');
const { crearModuloContenidoTema, listarModuloContenidoTemas, actualizarModuloContenidoTema,eliminarModuloContenidoTema, temaContenido }
       = require('../controllers/moduloContenidoTemaController');

router.post('/crear', auth, 
[
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('codigo_modulo_contenido').not().isEmpty().withMessage('El código contenido es obligatorio.')
], crearModuloContenidoTema, listarModuloContenidoTemas);

router.get('/listar/:codigo_modulo_contenido', auth, listarModuloContenidoTemas);

router.put('/actualizar', auth, 
[
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
    check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria, verifique'),
    check('codigo_modulo_contenido').not().isEmpty().withMessage('El codigo modulo es obligatorio, verifique'),
]
,actualizarModuloContenidoTema);

router.delete('/eliminar/:codigo', auth, 
[
    query('codigo_modulo_contenido').not().isEmpty().withMessage('El código contenido es obligatorio.')
], eliminarModuloContenidoTema, listarModuloContenidoTemas);

router.get('/temas/:codigo_modulo_contenido/:codigo_modulo/:codigo_unidad/:codigo_materia', temaContenido);


module.exports = router;