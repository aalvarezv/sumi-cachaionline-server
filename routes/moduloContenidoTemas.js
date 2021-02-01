const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const { crearModuloContenidoTema, listarModuloContenidoTemas, actualizarModuloContenidoTema,eliminarModuloContenidoTema, temaPorDescripcionContenidoModuloUnidadyMateria }
       = require('../controllers/moduloContenidoTemaController');

router.post('/crear', auth, [
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria.'),
    check('codigo_modulo_contenido').not().isEmpty().withMessage('El código contenido es obligatorio.').not().equals("0").withMessage('El código contenido es obligatorio.'),
], crearModuloContenidoTema);

router.get('/listar/:codigo_modulo_contenido', auth, listarModuloContenidoTemas);

router.put('/actualizar', auth,[
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria.'),
    check('codigo_modulo_contenido').not().isEmpty().withMessage('El código contenido es obligatorio.').not().equals("0").withMessage('El código contenido es obligatorio.'),
] ,actualizarModuloContenidoTema);

router.delete('/eliminar/:codigo', auth, eliminarModuloContenidoTema);
router.get('/busqueda/descripcion-contenido-modulo-unidad-materia/', temaPorDescripcionContenidoModuloUnidadyMateria);


module.exports = router;