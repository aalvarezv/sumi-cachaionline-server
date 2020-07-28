const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {listarMaterias, crearMateria, actualizarMaterias, eliminarMaterias, datosMaterias} = require('../controllers/materiaController');

router.post('/crear',auth, crearMateria);
router.get('/listar', auth, listarMaterias);
router.put('/actualizar', auth, actualizarMaterias);
router.delete('/eliminar/:codigo', auth, eliminarMaterias);
router.get('/datos/:codigo', auth, datosMaterias);

module.exports = router;