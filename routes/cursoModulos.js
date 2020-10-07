const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');
const { crearModuloCurso, eliminarModuloCurso }
       = require('../controllers/cursoModuloController');

router.post('/crear', auth, 
[
    check('codigo_curso').not().isEmpty().withMessage('El código curso es obligatorio.'),
    check('codigo_modulo').not().isEmpty().withMessage('El código módulo es obligatorio.')
], crearModuloCurso);

router.delete('/eliminar/:codigo_curso', auth, 
[
    query('codigo_modulo').not().isEmpty().withMessage('El código módulo es obligatorio')
], eliminarModuloCurso);


module.exports = router;