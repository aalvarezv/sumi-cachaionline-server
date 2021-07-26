const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');

const { crearCurso, actualizarCurso, eliminarCurso, 
        datosCurso, listarCursosUsuarioNivelAcademicoInstitucion, 
        listarUsuariosRingCurso, cursosInstitucionNivelAcademico } = require('../controllers/cursoController');

router.post('/crear', auth, [
    check('codigo').exists().withMessage('El código es obligatorio').notEmpty().withMessage('El código no debe ser vacío'),
    check('letra').exists().withMessage('La letra es obligatoria').notEmpty().withMessage('La letra no debe ser vacía'),
    check('codigo_nivel_academico').exists().withMessage('El nivel académico es obligatoria').notEmpty().withMessage('El nivel académico no debe ser vacío'),
], crearCurso);

router.put('/actualizar', auth, [
    check('codigo').exists().withMessage('El código es obligatorio').notEmpty().withMessage('El código no debe ser vacío'),
    check('letra').exists().withMessage('La letra es obligatoria').notEmpty().withMessage('La letra no debe ser vacía'),
    check('codigo_nivel_academico').exists().withMessage('El nivel académico es obligatoria').notEmpty().withMessage('El nivel académico no debe ser vacío'),
], actualizarCurso);

router.delete('/eliminar/:codigo', auth, eliminarCurso);

router.get('/datos/:codigo', auth, datosCurso);

router.get('/busqueda/institucion-nivel-academico/', [
    query('codigo_institucion').exists().withMessage('El código institución es obligatorio').notEmpty().withMessage('El código institución no debe ser vacío'),
    query('codigo_nivel_academico').exists().withMessage('El código nivel académico es obligatorio').notEmpty().withMessage('El código nivel académico no debe ser vacío'),
], auth, cursosInstitucionNivelAcademico);

router.get('/listar/usuario-nivel-academico-institucion', [
    query('rut_usuario').exists().withMessage('El rut usuario es obligatorio').notEmpty().withMessage('El rut usuario no debe ser vacío'),
    query('niveles_academicos').exists().withMessage('Los niveles academicos son obligatorios').notEmpty().withMessage('Los niveles académicos no deben ser vacía'),
    query('codigo_institucion').exists().withMessage('El código institución es obligatorio').notEmpty().withMessage('El código institución no debe ser vacío'),
], auth, listarCursosUsuarioNivelAcademicoInstitucion);

router.get('/listar/usuarios-ring', [
    query('codigo_curso').exists().withMessage('El código curso es obligatorio').notEmpty().withMessage('El código curso no debe ser vacío'),
    query('codigo_ring').exists().withMessage('El código ring es obligatorio').notEmpty().withMessage('El código ring no debe ser vacío'),
], auth, listarUsuariosRingCurso);

module.exports = router;