const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');
const { crearModuloContenidoTemaConepto, listarModuloContenidoTemaConceptos, 
    actualizarModuloContenidoTemaConcepto,eliminarModuloContenidoTemaConcepto, conceptosTemaContenidoModuloUnidadMateria }
       = require('../controllers/moduloContenidoTemaConceptoController');
const { listarPreguntaModulos } = require('../controllers/preguntaModuloController');

router.post('/crear', auth, 
[
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('codigo_modulo_contenido_tema').not().isEmpty().withMessage('El código tema es obligatorio.')
], crearModuloContenidoTemaConepto, listarPreguntaModulos);

router.get('/listar/:codigo_modulo_contenido_tema', auth, listarModuloContenidoTemaConceptos);

router.put('/actualizar', auth, 
[
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
    check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria, verifique'),
    check('codigo_modulo_contenido_tema').not().isEmpty().withMessage('El codigo modulo es obligatorio, verifique'),
]
,actualizarModuloContenidoTemaConcepto);

router.delete('/eliminar/:codigo', auth, eliminarModuloContenidoTemaConcepto);

router.get('/conceptos/:codigo_modulo_contenido_tema/:codigo_modulo_contenido/:codigo_modulo/:codigo_unidad/:codigo_materia', conceptosTemaContenidoModuloUnidadMateria)

module.exports = router;