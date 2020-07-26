const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const {crearUsuario, listarUsuarios, actualizarUsuario, eliminarUsuario, datosUsuario} = require('../controllers/usuarioController');

router.post('/crear', crearUsuario);
router.get('/listar', auth, listarUsuarios);
router.put('/actualizar', auth, actualizarUsuario);
router.delete('/eliminar/:rut', auth, eliminarUsuario);
router.get('/datos/:rut', auth, datosUsuario);

module.exports = router;