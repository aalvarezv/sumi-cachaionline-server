const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paginateResults = require('../middleware/paginateResults');
const { body, check, query } = require('express-validator');

const {crearUsuario, listarUsuarios, actualizarUsuario, listarUsuariosNivelAcademico,
       eliminarUsuario, datosUsuario, busquedaUsuarios, 
       listarUsuariosInscritosDisponiblesCurso, cargaMasivaUsuarios, actualizarAvatar} = require('../controllers/usuarioController');

router.post('/crear', [
    check('rut', 'El rut es obligatorio.').notEmpty().isLength({ min: 8, max: 9 }).withMessage('El rut no es válido.'),
    check('nombre').not().isEmpty().withMessage('El nombre es obligatorio.'),
    check('email', 'El email es obligatorio.').notEmpty().isEmail().withMessage('No es un email válido.'),
    check('clave').not().isEmpty().withMessage('La clave es obligatoria.'),
], crearUsuario);

router.get('/listar', auth, listarUsuarios, paginateResults);

router.get('/listar-por-nivel-academico', auth, listarUsuariosNivelAcademico);
//lista todos los usuarios inscritos en un curso y aquellos que están disponibles para inscribir
//corresponden a los que no se encuentran en un curso dentro de la misma institución.
router.get('/listar-inscritos-disponibles-curso', auth, listarUsuariosInscritosDisponiblesCurso);


router.put('/actualizar', auth, [
    check('rut', 'El rut es obligatorio.').notEmpty().isLength({ min: 8, max: 9 }).withMessage('El rut no es válido.'),
    check('nombre').not().isEmpty().withMessage('El nombre es obligatorio.'),
    check('email', 'El email es obligatorio.').notEmpty().isEmail().withMessage('No es un email válido.'),
    check('clave').not().isEmpty().withMessage('La clave es obligatoria.'),
], actualizarUsuario);
router.post('/carga-masiva', auth, cargaMasivaUsuarios);
router.delete('/eliminar/:rut', auth, eliminarUsuario);
router.get('/datos/:rut', auth, datosUsuario);
router.get('/busqueda', auth, busquedaUsuarios);
router.put('/actualiza-avatar', auth, [
    check('rut').exists().withMessage('El rut es obligatorio').notEmpty().withMessage('El rut no puede ser vacío'),
    check('avatar_color').exists().withMessage('El color del avatar es obligatorio').isNumeric().withMessage('El color del avatar debe ser un número'),
    check('avatar_textura').exists().withMessage('La textura del avatar es obligatoria').isNumeric().withMessage('La textura del avatar debe ser un número'),
    check('avatar_sombrero').exists().withMessage('El sombrero del avatar es obligatorio').isNumeric().withMessage('El sombrero del avatar debe ser un número'),
    check('avatar_accesorio').exists().withMessage('El accesorio del avatar es obligatorio').isNumeric().withMessage('El accesorio del avatar debe ser un número'),
], actualizarAvatar);


module.exports = router;