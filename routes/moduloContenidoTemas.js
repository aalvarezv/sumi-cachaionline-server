const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');
const { crearModuloContenidoTema, listarModuloContenidoTemas, eliminarModuloContenidoTema }
       = require('../controllers/moduloContenidoTemaController');

router.post('/crear', auth, 
[
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('codigo_modulo_contenido').not().isEmpty().withMessage('El código contenido es obligatorio.')
], crearModuloContenidoTema, listarModuloContenidoTemas);

router.get('/listar/:codigo_modulo_contenido', auth, listarModuloContenidoTemas);


router.delete('/eliminar/:codigo', auth, 
[
    query('codigo_modulo_contenido').not().isEmpty().withMessage('El código contenido es obligatorio.')
], eliminarModuloContenidoTema, listarModuloContenidoTemas);


module.exports = router;