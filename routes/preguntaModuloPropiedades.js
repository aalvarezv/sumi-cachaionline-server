const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, check, query } = require('express-validator');

const { crearPreguntaModuloPropiedad, listarPreguntaModuloPropiedades,
       eliminarPreguntaModuloPropiedad} = require('../controllers/PreguntaModuloPropiedadController');

router.post('/crear', auth, [
    check('codigo_pregunta').not().isEmpty().withMessage('El codigo de la pregunta es obligatorio.'),
    check('codigo_modulo_propiedad').not().isEmpty().withMessage('El código del modulo propiedad es obligatorio.')
], crearPreguntaModuloPropiedad);

router.get('/listar', auth, listarPreguntaModuloPropiedades);

router.delete('/eliminar/:codigo_pregunta', auth, [
    check('codigo_pregunta').not().isEmpty().withMessage('El codigo de la pregunta es obligatorio.'),
    check('codigo_modulo_propiedad').not().isEmpty().withMessage('El código del modulo propiedad es obligatorio.')
], eliminarPreguntaModuloPropiedad);


module.exports = router;