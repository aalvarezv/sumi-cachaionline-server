const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paginateResults = require('../middleware/paginateResults');
const { check, query } = require('express-validator');

const {crearModulo,listarModulos, listarModulosDisponiblesCurso,  actualizarModulo, 
       eliminarModulo, datosModulo, busquedaModulos, modulosUnidad, modulosUnidadMateria} = require('../controllers/moduloController');


router.post('/crear', auth, 
[
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
    check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria, verifique'),
    check('codigo_unidad').not().isEmpty().withMessage('El codigo unidad es obligatorio, verifique'),
]
,crearModulo);

router.get('/listar', auth, listarModulos, paginateResults);

//lista todos los modulos disponibles para un curso.
router.get('/listar-disponibles-curso', auth, 
[   
    query('filters').custom(filters => {
        const {descripcion} = JSON.parse(filters)
        if (descripcion === undefined) {
            throw new Error('La descripción es obligatoria');
        }
        return true;
    }),
    query('filters').custom(filters => {
        const {codigo_materia} = JSON.parse(filters)
        if (codigo_materia === undefined) {
            throw new Error('El código materia es obligatoria');
        }
        return true;
    }),
    query('filters').custom(filters => {
        const {codigo_curso} = JSON.parse(filters)
        if (codigo_curso === undefined) {
            throw new Error('El código curso es obligatorio');
        }
        return true;
    })
], listarModulosDisponiblesCurso, paginateResults);

router.put('/actualizar', auth,
[
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
    check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria, verifique'),
    check('codigo_unidad').not().isEmpty().withMessage('El codigo unidad es obligatorio, verifique'),
],
actualizarModulo);
router.delete('/eliminar/:codigo', auth, eliminarModulo);
router.get('/datos/:codigo', auth, datosModulo);
router.get('/unidad/:codigo_unidad', modulosUnidad);
router.get('/unidad-materia/:codigo_unidad/:codigo_materia', modulosUnidadMateria)
router.get('/busqueda/:filtro', auth, busquedaModulos);

module.exports = router;