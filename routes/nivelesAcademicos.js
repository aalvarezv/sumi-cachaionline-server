const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const { crearNivelAcademico, listarNivelesAcademicos, actualizarNivelAcademico, eliminarNivelAcademico, datosNivelAcademico, busquedaNivelesAcademicos, listarNivelesAcademicosUsuarioInstitucion } = require('../controllers/nivelAcademicoController');

router.post('/crear', auth, [
        check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
        check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria, verifique')
    ],
    crearNivelAcademico);
router.get('/listar', listarNivelesAcademicos);
router.put('/actualizar', auth, [
        check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
        check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria, verifique')
    ],
    actualizarNivelAcademico);
router.delete('/eliminar/:codigo', auth, eliminarNivelAcademico);
router.get('/datos/:codigo', auth, datosNivelAcademico);
router.get('/busqueda/:filtro', auth, busquedaNivelesAcademicos);
router.get('/usuario-institucion', auth, listarNivelesAcademicosUsuarioInstitucion);

module.exports = router;