const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const { crearCurso, listarCursos, actualizarCurso, eliminarCurso, 
        datosCurso, busquedaCursos, listarCursosUsuarioNivelAcademicoInstitucion, 
        listarUsuariosRingCurso } = require('../controllers/cursoController');

router.post('/crear', auth, [
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio.'),
    check('letra').not().isEmpty().withMessage('La letra es obligatorio.'),
    check('codigo_nivel_academico').not().isEmpty().withMessage('El nivel academico de rol es obligatorio.')
], crearCurso);

router.put('/actualizar', auth, [
        check('codigo').not().isEmpty().withMessage('El codigo es obligatorio.'),
        check('letra').not().isEmpty().withMessage('La letra es obligatorio.'),
        check('codigo_nivel_academico').not().isEmpty().withMessage('El nivel academico de rol es obligatorio.')
    ],
    actualizarCurso);
router.delete('/eliminar/:codigo', auth, eliminarCurso);
router.get('/datos/:codigo', auth, datosCurso);
router.get('/busqueda/:filtro', auth, busquedaCursos);
router.get('/listar/usuario-nivel-academico-institucion', auth, listarCursosUsuarioNivelAcademicoInstitucion);
router.get('/listar/usuarios-ring', auth, listarUsuariosRingCurso);

module.exports = router;