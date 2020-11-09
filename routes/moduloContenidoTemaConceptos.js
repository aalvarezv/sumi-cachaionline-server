const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');
const { crearModuloContenidoTemaConepto, listarModuloContenidoTemaConceptos, eliminarModuloContenidoTemaConcepto }
       = require('../controllers/moduloContenidoTemaConceptoController');
const { listarPreguntaModulos } = require('../controllers/preguntaModuloController');

router.post('/crear', auth, 
[
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('codigo_modulo_contenido_tema').not().isEmpty().withMessage('El código tema es obligatorio.')
], crearModuloContenidoTemaConepto, listarPreguntaModulos);

router.get('/listar/:codigo_modulo_contenido_tema', auth, listarModuloContenidoTemaConceptos);


router.delete('/eliminar/:codigo', auth, 
[
    query('codigo_modulo_contenido_tema').not().isEmpty().withMessage('El código tema es obligatorio.')
], eliminarModuloContenidoTemaConcepto, listarModuloContenidoTemaConceptos);


module.exports = router;