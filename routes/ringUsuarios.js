const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');

const { crearRingUsuario, eliminarRingUsuario, crearRingUsuarioMasivo, eliminarRingUsuarioMasivo } = require('../controllers/ringUsuarioController');

router.post('/crear', auth, [
    check('codigo_ring').not().isEmpty().withMessage('El codigo del ring es obligatorio.'),
    check('rut_usuario').not().isEmpty().withMessage('El rut del usuario es obligatorio.'),
], crearRingUsuario);

router.post('/crear/masivo', auth,[
    check('ring_usuarios_add').not().isEmpty().withMessage('Es requerido un arreglo con al menos un objeto que contenga el rut usuario y código ring para agregar.')
], crearRingUsuarioMasivo);


router.delete('/eliminar/:codigo_ring/:rut_usuario', auth, eliminarRingUsuario);
router.delete('/eliminar/masivo',[
    query('ring_usuarios_del').exists().withMessage('Es requerido un parametro tipo arreglo con al menos un objeto que contenga el rut usuario y código ring para eliminar.'),
], auth, eliminarRingUsuarioMasivo);

module.exports = router;