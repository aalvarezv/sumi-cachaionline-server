const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, param, query } = require('express-validator');
const { agregarUsuarioCurso, listarUsuarioCurso, eliminarUsuarioCurso } = require('../controllers/cursoUsuarioController');


router.post('/agregar-usuario-curso', auth, [
    check('codigo_curso').not().isEmpty().withMessage('El código curso es obligatorio.'),
    check('rut_usuario').not().isEmpty().withMessage('El rut del usuario es obligatorio.')
], agregarUsuarioCurso);

router.get('/listar-usuarios-curso/:codigo_curso', auth, listarUsuarioCurso);

router.delete('/eliminar-usuario-curso/:codigo_curso', auth, [
    query('rut_usuario').not().isEmpty().withMessage('El rut del usuario es obligatorio')
], eliminarUsuarioCurso);

module.exports = router;