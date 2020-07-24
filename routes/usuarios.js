const express = require('express');
const router = express.Router();
const {crearUsuario, listarUsuarios} = require('../controllers/usuarioController');

//ruta inicial /api/usuarios/
router.post('/', crearUsuario);
router.get('/', listarUsuarios);

module.exports = router;