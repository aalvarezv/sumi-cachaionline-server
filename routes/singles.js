const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const { iniciarSingle, finalizarSingle } = require('../controllers/singleController');

router.post('/iniciar', auth, [
    check('cantidad_preguntas').not().isEmpty().withMessage('La cantidad de preguntas es obligatoria.').isInt({ min:1 }).withMessage('La cantidad de preguntas debe ser mayor a 0.'),
    check('tiempo').not().isEmpty().withMessage('El tiempo es obligatorio.').isInt({ min:1, max: 300}).withMessage('El tiempo no puede ser menor a 0 ni mayor a 300 segundos 5 minutos.'),
], iniciarSingle);

router.put('/finalizar', auth, [
    check('codigo').not().isEmpty().withMessage('El código es obligatorio.'),
], finalizarSingle);


module.exports = router