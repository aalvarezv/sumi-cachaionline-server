const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { crearTableroObjetivos, 
        listarObjetivosUnidadMineduc,
        cambiarEstadoObjetivosUnidadMineduc, 
        actualizarFechasObjetivosUnidadMineduc} = require('../controllers/mineducTableroObjetivoController');

router.post('/crear-tablero', auth, crearTableroObjetivos);
router.get('/listar-objetivos-unidad-mineduc', auth, listarObjetivosUnidadMineduc);
router.put('/cambiar-estado', auth, cambiarEstadoObjetivosUnidadMineduc);
router.put('/actualizar-fechas', auth, actualizarFechasObjetivosUnidadMineduc);

module.exports = router;