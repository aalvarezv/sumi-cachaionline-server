const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { crearNivelAcademico, listarNivelesAcademicos, actualizarNivelAcademico, eliminarNivelAcademico, datosNivelAcademico} = require('../controllers/nivelAcademicoController');

router.post('/crear', auth, crearNivelAcademico);
router.get('/listar', auth, listarNivelesAcademicos);
router.put('/actualizar', auth, actualizarNivelAcademico);
router.delete('/eliminar/:codigo', auth, eliminarNivelAcademico);
router.get('/datos/:codigo', auth, datosNivelAcademico);


module.exports = router;