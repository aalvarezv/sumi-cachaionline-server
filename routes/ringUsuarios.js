const express = require('express');
const moment = require('moment');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, query } = require('express-validator');
const { crearRingUsuario, eliminarRingUsuario, 
        crearRingUsuarioMasivo, eliminarRingUsuarioMasivo,
        listarRingsUsuarioInstitucion, 
        listarUsuariosRing} = require('../controllers/ringUsuarioController');


router.post('/crear', auth, [
    check('codigo_ring').not().isEmpty().withMessage('El codigo del ring es obligatorio.'),
    check('rut_usuario').not().isEmpty().withMessage('El rut del usuario es obligatorio.'),
], crearRingUsuario);

router.post('/crear/masivo', auth,[
    check('ring_usuarios_add').not().isEmpty().withMessage('Es requerido un arreglo con al menos un objeto que contenga el rut usuario y código ring para agregar.')
], crearRingUsuarioMasivo);
 //auth,
router.get('/listar/rings-usuario-institucion', [
    query('codigo_institucion').exists().withMessage('El código de la institución es obligatorio.'),
    query('rut_usuario').exists().withMessage('El rut del usuario es obligatorio.'),
    query('estado_ring').exists().withMessage('El parámetro estado ring es obligatorio 0 para obtener los rings finalizados, 1 para obtener los rings activos y distinto de 0 y 1 para obtener todos los rings tanto finalizados como activos.')
], listarRingsUsuarioInstitucion);

router.get('/listar/usuarios-ring', auth, listarUsuariosRing)

router.delete('/eliminar/:codigo_ring/:rut_usuario', auth, eliminarRingUsuario);

router.delete('/eliminar/masivo',[
    query('ring_usuarios_del').exists().withMessage('Es requerido un parametro tipo arreglo con al menos un objeto que contenga el rut usuario y código ring para eliminar.'),
], auth, eliminarRingUsuarioMasivo);

module.exports = router;