const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { cargaMateriasUnidadesModulos } = require('../controllers/cargaMasivaController');


router.post('/materias-unidades-modulos', auth, cargaMateriasUnidadesModulos);

module.exports = router;