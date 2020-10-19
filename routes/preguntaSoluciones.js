const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, check } = require('express-validator');

const { crearPreguntaSolucion, listarPreguntaSolucion, eliminarPreguntaSolucion } = require('../controllers/preguntaSolucionController');

router.post('/crear', auth, 
    [
        check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique.'),
        check('codigo_pregunta').not().isEmpty().withMessage('El codigo de la pregunta es obligatorio, verifique.'),
        body('numero').if(body('numero').exists()).isNumeric().withMessage('No es un numero válido, verifique.')
    ],
    crearPreguntaSolucion);
router.get('/listar', listarPreguntaSolucion);

router.delete('/eliminar/:codigo', auth, eliminarPreguntaSolucion);


module.exports = router;