const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const { crearModuloContenidoTemaConcepto, listarModuloContenidoTemaConceptos,  actualizarModuloContenidoTemaConcepto, eliminarModuloContenidoTemaConcepto, conceptosPorDescripcionTemaContenidoModuloUnidadyMateria }
       = require('../controllers/moduloContenidoTemaConceptoController');
       
router.post('/crear', auth, [
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria.'),
    check('codigo_modulo_contenido_tema').not().isEmpty().withMessage('El código tema es obligatorio.').not().equals("0").withMessage('El código tema es obligatorio.'),
], crearModuloContenidoTemaConcepto);

router.get('/listar/:codigo_modulo_contenido_tema', auth, listarModuloContenidoTemaConceptos);

router.put('/actualizar', auth, [
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio.'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria.'),
    check('codigo_modulo_contenido_tema').not().isEmpty().withMessage('El código tema es obligatorio.').not().equals("0").withMessage('El código tema es obligatorio.'),
], actualizarModuloContenidoTemaConcepto);

router.delete('/eliminar/:codigo', auth, eliminarModuloContenidoTemaConcepto);

router.get('/busqueda/descripcion-tema-contenido-modulo-unidad-materia/', conceptosPorDescripcionTemaContenidoModuloUnidadyMateria)

module.exports = router;