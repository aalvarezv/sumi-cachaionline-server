const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');
const { crearPropiedadModulo, eliminarPropiedadModulo }
       = require('../controllers/moduloPropiedadController');

router.post('/crear', auth, 
[
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
    check('codigo_modulo').not().isEmpty().withMessage('El código módulo es obligatorio.')
], crearPropiedadModulo);

router.delete('/eliminar/:codigo', auth, 
[
    query('codigo').not().isEmpty().withMessage('El código es obligatorio')
], eliminarPropiedadModulo);


module.exports = router;