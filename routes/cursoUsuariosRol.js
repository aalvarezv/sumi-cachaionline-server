const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, param, query } = require('express-validator');
const { crearUsuarioCursoRol, eliminarUsuarioCursoRol, listarCursosUsuarioRol } = require('../controllers/cursoUsuarioRolController');


router.post('/crear', auth, [
    check('rut_usuario').not().isEmpty().withMessage('El rut del usuario es obligatorio.'),
    check('codigo_curso').not().isEmpty().withMessage('El código curso es obligatorio.'),
    check('codigo_rol').not().isEmpty().withMessage('El código rol es obligatorio.')
], crearUsuarioCursoRol);

router.delete('/eliminar/:codigo_curso', auth, [
    query('rut_usuario').not().isEmpty().withMessage('El rut del usuario es obligatorio.'),
    query('codigo_rol').not().isEmpty().withMessage('El código rol es obligatorio.')
], eliminarUsuarioCursoRol);

router.get('/consulta/usuario-rol-inscrito-curso', auth, [
    query('rut_usuario').not().isEmpty().withMessage('El rut del usuario es obligatorio.'),
    query('codigo_rol').not().isEmpty().withMessage('El código rol es obligatorio.'),
    query('codigo_institucion').not().isEmpty().withMessage('El codigo institución es obligatorio.'),
    query('codigo_nivel_academico').not().isEmpty().withMessage('El código nivel academico es obligatorio.')
], listarCursosUsuarioRol)

module.exports = router;