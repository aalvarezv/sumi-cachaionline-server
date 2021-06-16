const express = require('express');
const router = express.Router();
const { check, query } = require('express-validator');

const { obtieneEmailUsuario, enviaEmailUsuario, actualizaClave } = require('../controllers/usuarioRecuperaClaveController')

router.get('/obtieneEmailUsuario', [
    query('rut').exists().withMessage('El rut es obligatorio.').notEmpty().withMessage('El rut no puede ser vacío'),
 ], obtieneEmailUsuario);
router.post('/enviaEmail', [
    check('rut').exists().withMessage('El rut es obligatorio.').notEmpty().withMessage('El rut no puede ser vacío'),
], enviaEmailUsuario);
router.put('/actualizaClave', [
    //debe existir y no debe estar vacíos.
    check('rut').exists().withMessage('El rut es obligatorio.').notEmpty().withMessage('El rut no puede ser vacío'),
    check('clave').exists().withMessage('La clave es obligatoria.').notEmpty().withMessage('La clave no puede ser vacía.'),
    check('codigoRecuperaClave').exists().withMessage('El código de recuperación es obligatorio.').notEmpty().withMessage('El código de recuperación no puede ser vacío.'),
], actualizaClave);

module.exports = router;