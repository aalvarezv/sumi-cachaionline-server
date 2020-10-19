const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');
const { crearPropiedadModulo, listarPropiedadesModulo, eliminarPropiedadModulo }
       = require('../controllers/moduloPropiedadController');

router.post('/crear', auth, 
[
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('codigo_modulo').not().isEmpty().withMessage('El código módulo es obligatorio.')
], crearPropiedadModulo, listarPropiedadesModulo);

router.get('/listar/:codigo_modulo', auth, listarPropiedadesModulo);


router.delete('/eliminar/:codigo', auth, 
[
    query('codigo_modulo').not().isEmpty().withMessage('El código módulo es obligatorio.')
], eliminarPropiedadModulo, listarPropiedadesModulo);


module.exports = router;