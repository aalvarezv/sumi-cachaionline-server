const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { crearTableroHabilidad, listarHabilidadesUnidadMineduc,
        cambiarEstadoHabilidadUnidadMineduc } = require('../controllers/mineducTableroHabilidadController');


router.post('/crear-tablero', auth, crearTableroHabilidad);
router.get('/listar-habilidades-unidad-mineduc', auth, listarHabilidadesUnidadMineduc);
router.put('/cambiar-estado', auth, cambiarEstadoHabilidadUnidadMineduc);

module.exports = router;