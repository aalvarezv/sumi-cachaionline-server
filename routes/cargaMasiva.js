const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { cargaMateriasUnidadesModulos, cargaPreguntas } = require('../controllers/cargaMasivaController');


router.post('/unidades-modulos-contenidos-temas-conceptos', auth, cargaMateriasUnidadesModulos);
router.post('/preguntas', auth, cargaPreguntas);


module.exports = router;