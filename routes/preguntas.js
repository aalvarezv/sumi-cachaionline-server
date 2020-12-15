const express = require('express'); 
const router = express.Router();
const auth = require('../middleware/auth');

const {listarPreguntas, listarPreguntasRing, crearPregunta, eliminarPregunta, actualizarPregunta, datosPreguntas} = require('../controllers/preguntaController');

router.post('/crear', auth, crearPregunta);
router.get('/listar', auth, listarPreguntas);
router.get('/listar/ring', auth, listarPreguntasRing);
router.delete('/eliminar/:codigo', auth, eliminarPregunta);
router.put('/actualizar', auth, actualizarPregunta);
router.get('/datos/:codigo', auth, datosPreguntas);

module.exports = router;