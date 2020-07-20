const express = require('express'); 
const router = express.Router();
const {listarPreguntas} = require('../controllers/preguntaController');

router.get('/', listarPreguntas);

module.exports = router;