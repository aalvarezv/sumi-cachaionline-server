const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

const {listarAlternativas, crearAlternativa, actualizarAlternativa, eliminarAlternativa, datosAlternativa} = require('../controllers/alternativaController');

router.post('/crear', auth, crearAlternativa);
router.get('/listar', auth, listarAlternativas);
router.put('/actualizar', auth, actualizarAlternativa);
router.delete('/eliminar/:codigo', auth, eliminarAlternativa);
router.get('/datos/:codigo', auth, datosAlternativa);




module.exports = router;
