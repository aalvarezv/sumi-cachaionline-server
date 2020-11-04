const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { cargaMateriasUnidadesModulos } = require('../controllers/cargaMasivaController');


router.post('/unidades-modulos-propiedades-subpropiedades', auth, cargaMateriasUnidadesModulos);

module.exports = router;