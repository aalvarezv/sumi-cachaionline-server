const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paginateResults = require('../middleware/paginateResults');
const { check } = require('express-validator');

const {listarModulos, crearModulo, actualizarModulo, 
        eliminarModulo, datosModulo, busquedaModulos} = require('../controllers/moduloController');


router.post('/crear', auth, 
[
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
    check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria, verifique'),
    check('codigo_unidad').not().isEmpty().withMessage('El codigo unidad es obligatorio, verifique'),
    check('codigo_nivel_academico').not().isEmpty().withMessage('El codigo nivel academico es obligatorio, verifique')
]
,crearModulo);
router.get('/listar', auth, listarModulos, paginateResults);
router.put('/actualizar', auth, actualizarModulo);
router.delete('/eliminar/:codigo', auth, eliminarModulo);
router.get('/datos/:codigo', auth, datosModulo);
router.get('/busqueda/:filtro', auth, busquedaModulos);

module.exports = router;