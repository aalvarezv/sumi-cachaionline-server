const express = require('express');
const { cargaMasivaUsuarios } = require('../controllers/cargaMasivaUsuarioController');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/datos-carga-usuarios', auth, cargaMasivaUsuarios);

module.exports = router;