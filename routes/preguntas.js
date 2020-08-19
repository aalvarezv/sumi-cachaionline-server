const express = require('express'); 
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const {listarPreguntas, crearPregunta, actualizarPregunta, eliminarPregunta, datosPreguntas, busquedaPreguntas} = require('../controllers/preguntaController');

router.post('/crear', auth, 
[
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'), 
    check('pregunta_texto').not().isEmpty().withMessage('La pregunta texto es obligatoria, verifique'), 
    check('pregunta_imagen').not().isEmpty().withMessage('La pregunta imagen es obligatoria, verifique'),
    check('pregunta_audio').not().isEmpty().withMessage('La pregunta audio es obligatoria, verifique'),
    check('pregunta_video').not().isEmpty().withMessage('La pregunta video es obligatoria, verifique'),
    check('respuesta_texto').not().isEmpty().withMessage('La respuesta texto es obligatoria, verifique'), 
    check('respuesta_imagen').not().isEmpty().withMessage('La respuesta imagen es obligatoria, verifique'),
    check('respuesta_audio').not().isEmpty().withMessage('La respuesta audio es obligatoria, verifique'),
    check('respuesta_video').not().isEmpty().withMessage('La respuesta video es obligatoria, verifique'),
    check('codigo_modulo').not().isEmpty().withMessage('El codigo del modulo es obligatoria, verifique')
],
crearPregunta);

router.get('/listar', auth, listarPreguntas);
router.put('/actualizar', auth,   
[
    check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique'), 
    check('pregunta_texto').not().isEmpty().withMessage('La pregunta texto es obligatoria, verifique'), 
    check('pregunta_imagen').not().isEmpty().withMessage('La pregunta imagen es obligatoria, verifique'),
    check('pregunta_audio').not().isEmpty().withMessage('La pregunta audio es obligatoria, verifique'),
    check('pregunta_video').not().isEmpty().withMessage('La pregunta video es obligatoria, verifique'),
    check('respuesta_texto').not().isEmpty().withMessage('La respuesta texto es obligatoria, verifique'), 
    check('respuesta_imagen').not().isEmpty().withMessage('La respuesta imagen es obligatoria, verifique'),
    check('respuesta_audio').not().isEmpty().withMessage('La respuesta audio es obligatoria, verifique'),
    check('respuesta_video').not().isEmpty().withMessage('La respuesta video es obligatoria, verifique'),
    check('codigo_modulo').not().isEmpty().withMessage('El codigo del modulo es obligatoria, verifique')
],
actualizarPregunta);
router.delete('/eliminar/:codigo', auth, eliminarPregunta);
router.get('/datos/:codigo', auth, datosPreguntas);
router.get('/busqueda/:filtro', auth, busquedaPreguntas);

module.exports = router;