const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, param, query } = require('express-validator');
const { crearUsuarioCursoRol, eliminarUsuarioCursoRol } = require('../controllers/cursoUsuarioRolController');


router.post('/crear', auth, [
    check('rut_usuario').not().isEmpty().withMessage('El rut del usuario es obligatorio.'),
    check('codigo_curso').not().isEmpty().withMessage('El código curso es obligatorio.'),
    check('codigo_rol').not().isEmpty().withMessage('El código rol es obligatorio.')
], crearUsuarioCursoRol);

router.delete('/eliminar/:codigo_curso', auth, [
    query('rut_usuario').not().isEmpty().withMessage('El rut del usuario es obligatorio.'),
    query('codigo_rol').not().isEmpty().withMessage('El código rol es obligatorio.')
], eliminarUsuarioCursoRol);

module.exports = router;