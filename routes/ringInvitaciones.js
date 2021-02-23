const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { listarUsuariosInvitarRing, listarInvitacionesRingUsuario, 
    actualizarEstadoInvitacionRing, cantidadInvitacionesRingUsuario } = require('../controllers/ringInvitacionController')

router.get('/listar-usuarios', auth, listarUsuariosInvitarRing)
router.get('/listar-invitaciones-usuario', auth, listarInvitacionesRingUsuario)
router.get('/cantidad-invitaciones-usuario', cantidadInvitacionesRingUsuario)
router.put('/actualizar-estado', auth, actualizarEstadoInvitacionRing)

module.exports = router