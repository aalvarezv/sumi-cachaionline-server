const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paginateResults = require('../middleware/paginateResults');
const { body, check, query } = require('express-validator');

const {crearUsuario, listarUsuarios, actualizarUsuario, listarUsuariosNivelAcademico,
       eliminarUsuario, datosUsuario, busquedaUsuarios, listarUsuariosInscritosDisponiblesCurso} = require('../controllers/usuarioController');

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
router.get('/listar-inscritos-disponibles-curso', auth, 
[   
    query('filters').custom(filters => {
        const {nombre} = JSON.parse(filters)
        if (nombre === undefined) {
            throw new Error('El nombre es obligatorio');
        }
        return true;
    }),
    query('filters').custom(filters => {
        const {codigo_institucion} = JSON.parse(filters)
        if (codigo_institucion === undefined) {
            throw new Error('El código institucion es obligatorio');
        }
        return true;
    }),
    query('filters').custom(filters => {
        const {codigo_curso} = JSON.parse(filters)
        if (codigo_curso === undefined) {
            throw new Error('El código curso es obligatorio');
        }
        return true;
    }),
    query('filters').custom(filters => {
        const {codigo_rol} = JSON.parse(filters)
        if (codigo_rol === undefined) {
            throw new Error('El código rol es obligatorio');
        }
        return true;
    }),

], listarUsuariosInscritosDisponiblesCurso, paginateResults);

router.put('/actualizar', auth, [
    check('rut', 'El rut es obligatorio.').notEmpty().isLength({ min: 8, max: 9 }).withMessage('El rut no es válido.'),
    check('nombre').not().isEmpty().withMessage('El nombre es obligatorio.'),
    check('email', 'El email es obligatorio.').notEmpty().isEmail().withMessage('No es un email válido.'),
    check('clave').not().isEmpty().withMessage('La clave es obligatoria.'),
], actualizarUsuario);

router.delete('/eliminar/:rut', auth, eliminarUsuario);
router.get('/datos/:rut', auth, datosUsuario);
router.get('/busqueda', auth, busquedaUsuarios);

module.exports = router;