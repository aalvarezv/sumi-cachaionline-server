const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { crearTableroObjetivos, listarObjetivosUnidadMineduc,
        cambiarEstadoObjetivosUnidadMineduc } = require('../controllers/mineducTableroObjetivoController');


router.post('/crear-tablero', auth, crearTableroObjetivos);
router.get('/listar-objetivos-unidad-mineduc', auth, listarObjetivosUnidadMineduc);
router.put('/cambiar-estado', auth, cambiarEstadoObjetivosUnidadMineduc);



module.exports = router;