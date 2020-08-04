const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const {listarMaterias, crearMateria, actualizarMaterias, eliminarMaterias, datosMaterias} = require('../controllers/materiaController');

router.post('/crear',auth, [check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria, verifique')],crearMateria);
router.get('/listar', listarMaterias);
router.put('/actualizar', auth, actualizarMaterias);
router.delete('/eliminar/:codigo', auth, eliminarMaterias);
router.get('/datos/:codigo', auth, datosMaterias);

module.exports = router;