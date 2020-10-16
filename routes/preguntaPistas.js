const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');

const { crearPreguntaPista, listarPreguntaPista, eliminarPreguntaPista } = require('../controllers/preguntaPistaController');

router.post('/crear', auth, 
    [
        check('codigo').not().isEmpty().withMessage('El codigo es obligatorio, verifique.'),
        check('codigo_pregunta').not().isEmpty().withMessage('El codigo de la pregunta es obligatorio, verifique.')
    ],
    crearPreguntaPista);
router.get('/listar', listarPreguntaPista);

router.delete('/eliminar/:codigo', auth, eliminarPreguntaPista);


module.exports = router;