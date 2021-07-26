const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, param, query } = require('express-validator');
const { crearUsuarioCursoRol, eliminarUsuarioCursoRol, listarCursosUsuarioRol } = require('../controllers/cursoUsuarioRolController');


router.post('/crear', auth, [
    check('rut_usuario').exists().withMessage('El rut es obligatorio').notEmpty().withMessage('El rut no debe ser vacío'),
    check('codigo_curso').exists().withMessage('El código curso es obligatorio').notEmpty().withMessage('El código curso no debe ser vacío'),
    check('codigo_rol').exists().withMessage('El código rol es obligatorio').notEmpty().withMessage('El código rol no debe ser vacío')
], crearUsuarioCursoRol);

router.delete('/eliminar', auth, [
    query('rut_usuario').exists().withMessage('El rut es obligatorio').notEmpty().withMessage('El rut no debe ser vacío'),
    query('codigo_curso').exists().withMessage('El código curso es obligatorio').notEmpty().withMessage('El código curso no debe ser vacío'),
    query('codigo_rol').exists().withMessage('El código rol es obligatorio').notEmpty().withMessage('El código rol no debe ser vacío')
], eliminarUsuarioCursoRol);

router.get('/consulta/usuario-rol-inscrito-curso', auth, [
    query('rut_usuario').exists().withMessage('El rut es obligatorio').notEmpty().withMessage('El rut no debe ser vacío'),
    query('codigo_rol').exists().withMessage('El código rol es obligatorio').notEmpty().withMessage('El código rol no debe ser vacío'),
    query('codigo_institucion').exists().withMessage('El código institución es obligatorio').notEmpty().withMessage('El código institución no debe ser vacío'),
], listarCursosUsuarioRol)

module.exports = router;