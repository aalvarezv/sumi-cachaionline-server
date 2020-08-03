const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


const {listarUnidades, crearUnidad, actualizarUnidades, eliminarUnidades, datosUnidad, unidadesMateria} = require('../controllers/unidadController');


router.post('/crear', auth, crearUnidad)
router.get('/listar', auth, listarUnidades);
router.put('/actualizar', auth, actualizarUnidades)
router.delete('/eliminar/:codigo', auth, eliminarUnidades);
router.get('/datos/:codigo', auth, datosUnidad);
router.get('/materia/:codigo_materia', auth, unidadesMateria);

module.exports = router;