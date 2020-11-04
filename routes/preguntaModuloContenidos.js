const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, check, query } = require('express-validator');

const { crearPreguntaModuloContenido, listarPreguntaModuloContenido,
       eliminarPreguntaModuloContenido} = require('../controllers/PreguntaModuloContenidosController');

router.post('/crear', auth, [
    check('codigo_pregunta').not().isEmpty().withMessage('El codigo de la pregunta es obligatorio.'),
    check('codigo_modulo_contenido').not().isEmpty().withMessage('El código del contenido del modulo es obligatorio.')
], crearPreguntaModuloContenido);

router.get('/listar', auth, listarPreguntaModuloContenido);

router.delete('/eliminar/:codigo_pregunta', auth, [
    check('codigo_pregunta').not().isEmpty().withMessage('El codigo de la pregunta es obligatorio.'),
    check('codigo_modulo_contenido').not().isEmpty().withMessage('El código del contenido del modulo es obligatorio.')
], eliminarPreguntaModuloContenido);


module.exports = router;