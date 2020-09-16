const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, param, query } = require('express-validator');
const { agregarModuloCurso, listarModulosCurso, eliminarModuloCurso } = require('../controllers/cursoModuloController');

router.post('/agregar-modulo-curso',auth,
[
    check('codigo_curso').not().isEmpty().withMessage('El código curso es obligatorio.'),
    check('codigo_modulo').not().isEmpty().withMessage('El código módulo es obligatorio.')
], agregarModuloCurso);

router.get('/listar-modulos-curso/:codigo_curso', auth, listarModulosCurso);

router.delete('/eliminar-modulo-curso/:codigo_curso', auth, 
[
  query('codigo_modulo').not().isEmpty().withMessage('El código módulo es obligatorio')
], eliminarModuloCurso);


module.exports = router;