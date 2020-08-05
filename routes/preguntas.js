const express = require('express'); 
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const {listarPreguntas, crearPregunta, actualizarPregunta, eliminarPregunta, datosPreguntas} = require('../controllers/preguntaController');

router.post('/crear', auth, 
[
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'), 
    check('descripcion').not().isEmpty().withMessage('La descripción es obligatoria, verifique'), 
    check('imagen').not().isEmpty().withMessage('La imagen es obligatoria, verifique'),
    check('puntaje').not().isEmpty().withMessage('El puntaje es obligatorio, verifique'), 
    check('codigo_unidad').not().isEmpty().withMessage('La descripción es obligatoria, verifique')
],crearPregunta);

router.get('/listar', auth, listarPreguntas);
router.put('/actualizar', auth, actualizarPregunta);
router.delete('/eliminar/:codigo', auth, eliminarPregunta);
router.get('/datos/:codigo', auth, datosPreguntas);

module.exports = router;