const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { crearTableroHabilidad, 
        listarHabilidadesUnidadMineduc,
        cambiarEstadoHabilidadUnidadMineduc, 
        actualizarFechasHabilidadUnidadMineduc } = require('../controllers/mineducTableroHabilidadController');

router.post('/crear-tablero', auth, crearTableroHabilidad);
router.get('/listar-habilidades-unidad-mineduc', auth, listarHabilidadesUnidadMineduc);
router.put('/cambiar-estado', auth, cambiarEstadoHabilidadUnidadMineduc);
router.put('/actualizar-fechas', auth, actualizarFechasHabilidadUnidadMineduc);

module.exports = router;