const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const {crearAlternativa, listarAlternativas, actualizarAlternativa, eliminarAlternativa, datosAlternativa} = require('../controllers/alternativaController');

router.post('/crear', auth, [check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'),
check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria, verifique'),
check('correcta').not().isEmpty().withMessage('Si es correcta o no es obligatorio, verifique'),
check('codigo_pregunta').not().isEmpty().withMessage('El codigo de la pregunta es obligatorio, verifique')],crearAlternativa);
router.get('/listar', auth, listarAlternativas);
router.put('/actualizar', auth, actualizarAlternativa);
router.delete('/eliminar/:codigo', auth, eliminarAlternativa);
router.get('/datos/:codigo', auth, datosAlternativa);




module.exports = router;
