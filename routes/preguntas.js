const express = require('express'); 
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const {listarPreguntas, crearPregunta, eliminarPregunta, datosPreguntas} = require('../controllers/preguntaController');

router.post('/crear', auth, crearPregunta);
router.get('/listar', auth, listarPreguntas);
router.delete('/eliminar/:codigo', auth, eliminarPregunta);
router.get('/datos/:codigo', auth, datosPreguntas);

module.exports = router;