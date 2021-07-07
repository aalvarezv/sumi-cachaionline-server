const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { cargarPreguntas, enviarSugerencias } = require('../controllers/sugerenciaAlternativaPreguntaController');

router.post('/cargar-preguntas', auth, cargarPreguntas);
router.post('/enviar-sugerencias', auth, enviarSugerencias)

module.exports = router