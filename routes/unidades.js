const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


const {listarUnidades, crearUnidad, actualizarUnidades, eliminarUnidades, datosUnidad} = require('../controllers/unidadController');


router.post('/crear', auth, crearUnidad)
router.get('/listar', auth, listarUnidades);
router.put('/actualizar', auth, actualizarUnidades)
router.delete('/eliminar/:codigo', auth, eliminarUnidades);
router.get('/datos/:codigo', auth, datosUnidad);

module.exports = router;