const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const { listarMaterias, crearMateria, actualizarMaterias, eliminarMaterias, datosMaterias, busquedaMaterias } = require('../controllers/materiaController');

router.post('/crear', auth, 
    [
        check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
        check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria, verifique')
    ],
    crearMateria);
router.get('/listar', listarMaterias);
router.put('/actualizar', auth, 
    [
        check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
        check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria, verifique')
    ],
    actualizarMaterias);
router.delete('/eliminar/:codigo', auth, eliminarMaterias);
router.get('/datos/:codigo', auth, datosMaterias);
router.get('/busqueda/:filtro', auth, busquedaMaterias);

module.exports = router;