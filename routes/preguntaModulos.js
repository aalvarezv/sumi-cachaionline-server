const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, check, query } = require('express-validator');

const { crearPreguntaModulo, listarPreguntaModulos, eliminarPreguntaModulo } = require('../controllers/preguntaModuloController');

router.post('/crear', auth, [
    check('codigo_pregunta').not().isEmpty().withMessage('El codigo de la pregunta es obligatorio.'),
    check('codigo_modulo').not().isEmpty().withMessage('El código del modulo es obligatorio.')
], crearPreguntaModulo);

router.get('/listar', auth, listarPreguntaModulos);

router.delete('/eliminar/:codigo_pregunta', auth, [
   
    check('codigo_modulo').not().isEmpty().withMessage('El código del modulo es obligatorio.')
], eliminarPreguntaModulo);



module.exports = router;