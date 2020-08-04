const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const { crearNivelAcademico, listarNivelesAcademicos, actualizarNivelAcademico, eliminarNivelAcademico, datosNivelAcademico} = require('../controllers/nivelAcademicoController');

router.post('/crear', auth,[check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria, verifique')],crearNivelAcademico);
router.get('/listar', listarNivelesAcademicos);
router.put('/actualizar', auth, actualizarNivelAcademico);
router.delete('/eliminar/:codigo', auth, eliminarNivelAcademico);
router.get('/datos/:codigo', auth, datosNivelAcademico);


module.exports = router;