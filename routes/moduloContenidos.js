const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const { crearModuloContenido, listarModuloContenidos, actualizarModuloContenido, eliminarModuloContenido, contenidosPorDescripcionModuloUnidadyMateria} = require('../controllers/moduloContenidoController');

router.post('/crear', auth, [
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria.'),
    check('codigo_modulo').not().isEmpty().withMessage('El código módulo es obligatorio.').not().equals("0").withMessage('El código módulo es obligatorio.')
], crearModuloContenido);

router.get('/listar/:codigo_modulo', auth, listarModuloContenidos);

router.put('/actualizar', auth, [
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
    check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria, verifique'),
    check('codigo_modulo').not().isEmpty().withMessage('El código módulo es obligatorio.').not().equals("0").withMessage('El código módulo es obligatorio.')
], actualizarModuloContenido);

router.delete('/eliminar/:codigo', auth, eliminarModuloContenido);
router.get('/busqueda/descripcion-modulo-unidad-materia/', contenidosPorDescripcionModuloUnidadyMateria);

module.exports = router;