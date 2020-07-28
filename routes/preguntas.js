const express = require('express'); 
const router = express.Router();
const auth = require('../middleware/auth')

const {listarPreguntas, crearPregunta, actualizarPregunta, eliminarPregunta, datosPreguntas} = require('../controllers/preguntaController');

router.post('/crear', auth, crearPregunta);
router.get('/listar', auth, listarPreguntas);
router.put('/actualizar', auth, actualizarPregunta);
router.delete('/eliminar/:codigo', auth, eliminarPregunta);
router.get('/datos/:rut', auth, datosPreguntas);

module.exports = router;