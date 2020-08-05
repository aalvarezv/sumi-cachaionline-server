const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');


const {listarModulos, crearModulo, actualizarModulo, eliminarModulo, datosModulos} = require('../controllers/moduloController');
const { crearPregunta } = require('../controllers/preguntaController');


router.post('/crear', auth, 
[
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
    check('descripcion').not().isEmpty().withMessage('La descripcion es obligatoria, verifique'),
    check('codigo_unidad').not().isEmpty().withMessage('El codigo unidad es obligatorio, verifique'),
    check('codigo_nivel_academico').not().isEmpty().withMessage('El codigo nivel academico es obligatorio, verifique')
]
,crearModulo);
router.get('/listar', auth, listarModulos);
router.put('/actualizar', auth, actualizarModulo);
router.delete('/eliminar/:codigo', auth, eliminarModulo);
router.get('/datos/:codigo', auth, datosModulos);

module.exports = router;