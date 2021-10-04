const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { cargaMasivaMineduc } = require('../controllers/cargaMasivaMineducController');


router.post('/datos-carga-unidades-mineduc', auth, cargaMasivaMineduc);

module.exports = router;